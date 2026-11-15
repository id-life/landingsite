#!/usr/bin/env node
// The 3D model pipeline (PERF-14): every file under public/models goes through here, gets a content-hashed name, and
// is looked up by the code through src/components/gl/models-manifest.json.
//
//   twin (Digital Twin avatar): drop the 1,403 morph targets that no animation and no code uses (glTF Transform's
//     prune does not remove them), turn the two cornea materials from transmission (an extra scene pass) into plain
//     transparency, resample the animations, dedup and prune, resize textures to 1024 px (eyes, eye occlusion, tear
//     lines and corneas to 256), keep WebP, Meshopt-compress.
//   jellyfish (Connect): resample (drops the constant tracks), dedup and prune, textures to 1024 px, Draco -> Meshopt.
//   hero (dragon): already Meshopt (scripts/encode-hero-model.mjs); copied under its hashed name.
//
// The glTF Transform packages are not dependencies of the site; install them in a scratch folder and run this script
// from there (they are resolved from the current directory), as for encode-hero-model.mjs:
//   mkdir /tmp/models && cd /tmp/models && npm init -y && npm i @gltf-transform/core@4.2.1 \
//     @gltf-transform/extensions@4.2.1 @gltf-transform/functions@4.2.1 meshoptimizer@0.22.0 draco3dgltf@1.5.7 sharp@0.34.5
//   node <repo>/scripts/optimize-models.mjs <repo> <source dir with test-v3.glb, animal2_v2.glb, logo_v2.glb>
// The source files are the pre-pipeline originals (git show 3be6cc3:public/models/<name>); never feed an output back in.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const fromCwd = createRequire(join(process.cwd(), 'noop.js'));
const load = (name) => import(fromCwd.resolve(name));
const { NodeIO } = await load('@gltf-transform/core');
const { ALL_EXTENSIONS, EXTMeshoptCompression, KHRDracoMeshCompression, KHRMaterialsTransmission } =
  await load('@gltf-transform/extensions');
const { dedup, prune, resample, textureCompress } = await load('@gltf-transform/functions');
const draco3d = (await load('draco3dgltf')).default;
const { MeshoptEncoder, MeshoptDecoder } = await load('meshoptimizer');
const sharp = (await load('sharp')).default;

const [repo, sourceDir] = process.argv.slice(2);
if (!repo || !sourceDir) throw new Error('usage: optimize-models.mjs <repo> <source dir>');
const modelsDir = join(repo, 'public/models');

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'meshopt.encoder': MeshoptEncoder,
  'meshopt.decoder': MeshoptDecoder,
});

/**
 * Twin texture sizes by material. On a laptop the whole avatar is about 800 px tall, so a body part never covers more
 * than about 400 px: 512 for skin and clothes. The hair keeps 1024 (fine alpha strands). The eyes, eye occlusion, tear
 * lines and corneas, the nails and the inside of the mouth cover a few dozen pixels: 256.
 */
const TWIN_TEXTURES = [
  [/毛发/, 1024],
  [/眼睛|眼部阻塞|分裂线|c或nea|指甲|上齿|下颌|舌头/, 256],
];

/**
 * Animation channels that hold a node at its rest value for the whole clip move nothing: drop them (the jellyfish's
 * clip had 1,302 channels, mostly such). Same rule as gltfpack's default.
 */
function dropConstantChannels(doc) {
  let dropped = 0;
  for (const animation of doc.getRoot().listAnimations()) {
    for (const channel of animation.listChannels()) {
      const sampler = channel.getSampler();
      const node = channel.getTargetNode();
      const output = sampler?.getOutput();
      const path = channel.getTargetPath();
      if (!sampler || !node || !output || path === 'weights') continue;
      // getElement denormalizes quantized keyframes (the twin's rotations are int16 normalized).
      const cubic = sampler.getInterpolation() === 'CUBICSPLINE';
      const step = cubic ? 3 : 1;
      const at = (i) => output.getElement(i * step + (cubic ? 1 : 0), []);
      const first = at(0);
      let constant = true;
      for (let i = 1; i < output.getCount() / step && constant; i += 1) {
        const value = at(i);
        for (let k = 0; k < first.length; k += 1) if (Math.abs(value[k] - first[k]) > 1e-6) constant = false;
      }
      if (!constant) continue;
      // Only a channel that holds the node at its rest value is redundant: with several clips on one skeleton (the
      // twin has five), a constant that differs from the rest pose is what that clip does to the node.
      const rest = path === 'translation' ? node.getTranslation() : path === 'rotation' ? node.getRotation() : node.getScale();
      if (rest.some((v, k) => Math.abs(v - first[k]) > 1e-5)) continue;
      channel.dispose();
      dropped += 1;
    }
  }
  return dropped;
}

/** Tangents serve only normal maps: drop them from primitives whose material has none. */
function dropUnusedTangents(doc) {
  let dropped = 0;
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      if (prim.getAttribute('TANGENT') && !prim.getMaterial()?.getNormalTexture()) {
        prim.setAttribute('TANGENT', null);
        dropped += 1;
      }
    }
  }
  return dropped;
}

async function finish(doc, method) {
  for (const ext of doc.getRoot().listExtensionsUsed()) if (ext instanceof KHRDracoMeshCompression) ext.dispose();
  const channels = dropConstantChannels(doc);
  const tangents = dropUnusedTangents(doc);
  console.log(`  ${channels} constant animation channels dropped, ${tangents} unused tangent sets dropped`);
  await doc.transform(resample(), dedup(), prune({ keepAttributes: true }));
  doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method });
  return io.writeBinary(doc);
}

/**
 * Resize every texture to the largest size any material using it asks for: `sizes` maps a material-name pattern to a
 * size, first match wins, `fallback` otherwise. WebP throughout (the files already were).
 */
async function resizeTextures(doc, sizes, fallback, { quality = 85, bySlot } = {}) {
  const want = new Map();
  for (const material of doc.getRoot().listMaterials()) {
    const size = sizes.find(([pattern]) => pattern.test(material.getName()))?.[1] ?? fallback;
    const slots = {
      baseColor: material.getBaseColorTexture(),
      normal: material.getNormalTexture(),
      metallicRoughness: material.getMetallicRoughnessTexture(),
      occlusion: material.getOcclusionTexture(),
      emissive: material.getEmissiveTexture(),
    };
    for (const [slot, texture] of Object.entries(slots)) {
      if (!texture) continue;
      const slotSize = bySlot?.[slot] ?? size;
      want.set(texture, Math.max(want.get(texture) ?? 0, slotSize));
    }
  }
  for (const [texture, size] of want) texture.setName(`s${size}:${texture.getName()}`);
  for (const size of new Set(want.values())) {
    await doc.transform(
      textureCompress({
        encoder: sharp,
        targetFormat: 'webp',
        resize: [size, size],
        quality,
        pattern: new RegExp(`^s${size}:`),
      }),
    );
  }
  for (const texture of want.keys()) texture.setName(texture.getName().replace(/^s\d+:/, ''));
  return [...want.values()];
}

async function twin(file) {
  const doc = await io.read(file);
  let targets = 0;
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      for (const target of prim.listTargets()) {
        target.dispose();
        targets += 1;
      }
    }
    mesh.setWeights([]);
    const extras = { ...mesh.getExtras() };
    delete extras.targetNames;
    mesh.setExtras(extras);
  }
  for (const material of doc.getRoot().listMaterials()) {
    if (/c或nea/.test(material.getName())) {
      // The cornea: a thin transparent shell over the iris. Transmission made three.js render the whole scene a
      // second time for it; plain alpha blending at the same 0.3 look costs nothing.
      material.setExtension('KHR_materials_transmission', null);
      material.setAlphaMode('BLEND');
      const [r, g, b] = material.getBaseColorFactor();
      material.setBaseColorFactor([r, g, b, 0.3]);
    }
  }
  if (
    !doc
      .getRoot()
      .listMaterials()
      .some((m) => m.getExtension('KHR_materials_transmission'))
  ) {
    for (const ext of doc.getRoot().listExtensionsUsed()) if (ext instanceof KHRMaterialsTransmission) ext.dispose();
  }
  await doc.transform(prune({ keepAttributes: true }));
  const sizes = await resizeTextures(doc, TWIN_TEXTURES, 512);
  console.log(`twin: ${targets} morph targets removed; textures ${sizes.sort((a, b) => b - a).join(' ')} px`);
  // FILTER keeps the file's existing quantization and node transforms: AnimationGroupM0 builds the anatomy view from
  // this file's geometries and skeletons by name, so nothing structural may move.
  return finish(doc, EXTMeshoptCompression.EncoderMethod.FILTER);
}

async function jellyfish(file) {
  const doc = await io.read(file);
  // Colour and glow keep 1024 px; the normal and roughness maps of a translucent body read the same at 512.
  const sizes = await resizeTextures(doc, [], 1024, { quality: 80, bySlot: { normal: 512, metallicRoughness: 512 } });
  console.log(`jellyfish: textures ${sizes.join(' ')} px`);
  // gltfpack was tried as the last step (it quantizes the float keyframes, about 550 kB smaller) but drops the second
  // and third texture-coordinate sets and the mesh node names that Animal2Model looks up (JF_skin_in, JF_skin_out),
  // which broke the look; glTF Transform keeps both.
  return finish(doc, EXTMeshoptCompression.EncoderMethod.FILTER);
}

const hashed = (name, bytes) => `${name}.${createHash('sha256').update(bytes).digest('hex').slice(0, 10)}.glb`;

for (const old of readdirSync(modelsDir)) rmSync(join(modelsDir, old));
const manifest = {};
const write = (key, name, bytes) => {
  const out = hashed(name, bytes);
  writeFileSync(join(modelsDir, out), bytes);
  manifest[key] = `/models/${out}`;
  console.log(`${key}: /models/${out} ${bytes.length} B`);
};
write('twin', 'twin', await twin(join(sourceDir, 'test-v3.glb')));
write('jellyfish', 'jellyfish', await jellyfish(join(sourceDir, 'animal2_v2.glb')));
const hero = readFileSync(join(sourceDir, 'logo_v2.glb'));
write('hero', 'hero', hero); // unchanged bytes, hashed name
writeFileSync(join(repo, 'src/components/gl/models-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
