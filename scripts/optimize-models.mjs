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
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const fromCwd = createRequire(join(process.cwd(), 'noop.js'));
const load = (name) => import(fromCwd.resolve(name));
const { NodeIO } = await load('@gltf-transform/core');
const { ALL_EXTENSIONS, EXTMeshoptCompression, EXTTextureAVIF, KHRDracoMeshCompression, KHRMaterialsTransmission } =
  await load('@gltf-transform/extensions');
const { dedup, prune, quantize, reorder, resample, simplify, textureCompress, weld } = await load('@gltf-transform/functions');

// Experiment switches (PERF-14 second pass), e.g. OPT='{"resample":false,"jellyQuantize":true,"format":"avif"}'.
/** SSIM (all channels) of two PNG buffers of the same size, through ffmpeg's ssim filter. */
function ssim(a, b) {
  const dir = mkdtempSync(join(tmpdir(), 'ssim-'));
  writeFileSync(join(dir, 'a.png'), a);
  writeFileSync(join(dir, 'b.png'), b);
  const out = spawnSync('ffmpeg', ['-i', join(dir, 'a.png'), '-i', join(dir, 'b.png'), '-lavfi', 'ssim', '-f', 'null', '-'], {
    encoding: 'utf8',
  });
  rmSync(dir, { recursive: true, force: true });
  return Number(/All:([0-9.]+)/.exec(out.stderr)?.[1] ?? 0);
}

// The settings PERF-14's second pass chose (measured in the w1-3d run folder); OPT='{...}' overrides them for
// experiments. Equal-quality AVIF (matchSsim) is judged against WebP at twinQuality / jellyQuality.
const OPT = {
  resample: false, // resample() gave each sampler its own time track: larger than the keyframes it removed
  tidy: true,
  roundNodes: true,
  format: 'avif',
  matchSsim: true,
  twinQuality: 85,
  twinQualityBySize: {},
  jellyQuality: 80,
  twinPrecision: [['TEXCOORD', 12]],
  twinKeyTol: 1,
  twinDropTangents: true,
  corneaTransmission: true, // see the cornea note in twin(): without it the eyes look wrong
  corneaAlpha: 0.3,
  jellyQuantize: true,
  jellyKeyTol: 1,
  // Simplification is available but off: at ratio 0.9 / error 0.0005 the thin tentacles already read broken and
  // faceted in side-by-side renders (PERF-14 second pass), so no ratio passed the equivalence check.
  jellySimplify: 1,
  jellySimplifyError: 0.0005,
  ...JSON.parse(process.env.OPT ?? '{}'),
};
const draco3d = (await load('draco3dgltf')).default;
const { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } = await load('meshoptimizer');
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
 * than about 400 px: 512 for body skin and clothes. The hair keeps 1024 (fine alpha strands), the head skin 1024 and the
 * eyes 512 (the face is what people look at). Eye occlusion, tear lines and corneas, the nails and the inside of the
 * mouth cover a few dozen pixels: 256.
 */
const TWIN_TEXTURES = [
  [/毛发/, 1024],
  // The face carries the twin: head skin 1024 and eyes 512 (PERF-14 second pass: at 256 the iris and at 512 the skin
  // read softer than the original in close-up renders).
  [/皮肤头/, 1024],
  [/眼睛/, 512],
  [/眼部阻塞|分裂线|c或nea|指甲|上齿|下颌|舌头/, 256],
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

/**
 * Lower an attribute's precision in place, keeping its accessor type and the node transforms (so code that builds
 * meshes from these geometries, AnimationGroupM0, sees the same layout): normalized integers are rounded to a coarser
 * grid (`bits` of 16), floats to a 1/2^bits grid. Fewer distinct low bits compress much better under Meshopt; the
 * change is below a pixel (14-bit positions: 1/16384 of the model's extent; 12-bit UVs: a quarter of a texel at 1024).
 */
function reducePrecision(doc, semantic, bits) {
  let changed = 0;
  const done = new Set();
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      for (const name of prim.listSemantics()) {
        if (!name.startsWith(semantic)) continue;
        const accessor = prim.getAttribute(name);
        if (!accessor || done.has(accessor)) continue;
        done.add(accessor);
        const array = accessor.getArray();
        if (array instanceof Float32Array) {
          const grid = 2 ** bits;
          for (let i = 0; i < array.length; i += 1) array[i] = Math.round(array[i] * grid) / grid;
        } else if (accessor.getNormalized() && (array instanceof Int16Array || array instanceof Uint16Array)) {
          const step = 2 ** (16 - bits);
          const [lo, hi] = array instanceof Int16Array ? [-32767, 32767] : [0, 65535];
          for (let i = 0; i < array.length; i += 1) array[i] = Math.min(hi, Math.max(lo, Math.round(array[i] / step) * step));
        } else continue;
        accessor.setArray(array);
        changed += 1;
      }
    }
  }
  return changed;
}

const angleBetween = (a, b) =>
  (2 * Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]))) * 180) / Math.PI;
function slerp(a, b, t) {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const c = d < 0 ? b.map((v) => -v) : b;
  d = Math.abs(d);
  if (d > 0.9995) {
    const o = a.map((v, i) => v + (c[i] - v) * t);
    const n = Math.hypot(...o);
    return o.map((v) => v / n);
  }
  const th = Math.acos(d);
  const s = Math.sin(th);
  return a.map((v, i) => (Math.sin((1 - t) * th) * v + Math.sin(t * th) * c[i]) / s);
}

/**
 * Keyframe thinning with a stated error bound: a rotation channel keeps every `factor`-th key only if no dropped key
 * is more than `maxDegrees` from the slerp three.js plays between the kept ones (translations and scales: never
 * thinned). Thinned channels share one time track per clip, the others keep the full one, so the saving is in outputs.
 */
function thinKeyframes(doc, factor, maxDegrees) {
  let thinned = 0;
  let kept = 0;
  let worst = 0;
  for (const animation of doc.getRoot().listAnimations()) {
    const thinInputs = new Map();
    for (const channel of animation.listChannels()) {
      const sampler = channel.getSampler();
      const input = sampler.getInput();
      const times = input.getArray();
      if (channel.getTargetPath() !== 'rotation' || sampler.getInterpolation() !== 'LINEAR' || times.length < 8) continue;
      const output = sampler.getOutput();
      const q = (i) => output.getElement(i, []);
      const keep = [];
      for (let i = 0; i < times.length; i += factor) keep.push(i);
      if (keep[keep.length - 1] !== times.length - 1) keep.push(times.length - 1);
      let err = 0;
      for (let j = 0; j < keep.length - 1; j += 1) {
        for (let i = keep[j] + 1; i < keep[j + 1]; i += 1) {
          const t = (times[i] - times[keep[j]]) / (times[keep[j + 1]] - times[keep[j]]);
          err = Math.max(err, angleBetween(q(i), slerp(q(keep[j]), q(keep[j + 1]), t)));
        }
      }
      if (err > maxDegrees) {
        kept += 1;
        continue;
      }
      worst = Math.max(worst, err);
      if (!thinInputs.has(input)) {
        const thin = doc
          .createAccessor()
          .setType('SCALAR')
          .setBuffer(input.getBuffer())
          .setArray(Float32Array.from(keep.map((i) => times[i])));
        thinInputs.set(input, thin);
      }
      const values = output.getArray();
      const size = output.getElementSize();
      const out = new values.constructor(keep.length * size);
      keep.forEach((k, n) => out.set(values.subarray(k * size, k * size + size), n * size));
      // In place: a cloned accessor is written into the time track's buffer view and loses the quaternion filter.
      if (output.listParents().filter((parent) => parent !== doc.getRoot()).length === 1) output.setArray(out);
      else sampler.setOutput(output.clone().setArray(out));
      sampler.setInput(thinInputs.get(input));
      thinned += 1;
    }
  }
  return { thinned, kept, worstDegrees: +worst.toFixed(3) };
}

/** Node transforms written with 6 significant digits instead of 17: the JSON shrinks, the pose does not move. */
function roundNodeTransforms(doc) {
  const r = (v) => Number(v.toPrecision(6));
  for (const node of doc.getRoot().listNodes()) {
    node.setTranslation(node.getTranslation().map(r));
    node.setRotation(node.getRotation().map(r));
    node.setScale(node.getScale().map(r));
  }
}

/**
 * Lossless attribute clean-up: vertex colours that are white everywhere change nothing (the twin's sneakers), and
 * float UVs that lie in [0, 1] fit 16-bit normalized integers exactly enough (1/65535 of the texture).
 */
function tidyAttributes(doc) {
  let colours = 0;
  let uvs = 0;
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const colour = prim.getAttribute('COLOR_0');
      if (colour) {
        const el = [];
        let white = true;
        for (let i = 0; i < colour.getCount() && white; i += 1) {
          colour.getElement(i, el);
          white = el.every((v) => Math.abs(v - 1) < 1e-3);
        }
        if (white) {
          prim.setAttribute('COLOR_0', null);
          colours += 1;
        }
      }
      for (const name of prim.listSemantics().filter((n) => n.startsWith('TEXCOORD_'))) {
        const uv = prim.getAttribute(name);
        const array = uv.getArray();
        if (!(array instanceof Float32Array) || array.some((v) => v < 0 || v > 1)) continue;
        const packed = new Uint16Array(array.length);
        for (let i = 0; i < array.length; i += 1) packed[i] = Math.round(array[i] * 65535);
        const quantized = doc
          .createAccessor()
          .setType(uv.getType())
          .setArray(packed)
          .setNormalized(true)
          .setBuffer(uv.getBuffer());
        prim.setAttribute(name, quantized);
        uvs += 1;
      }
    }
  }
  return { colours, uvs };
}

/** Samplers no channel uses (left behind when channels are dropped) cost JSON and accessors: remove them. */
function dropUnusedSamplers(doc) {
  let dropped = 0;
  for (const animation of doc.getRoot().listAnimations()) {
    const used = new Set(animation.listChannels().map((channel) => channel.getSampler()));
    for (const sampler of animation.listSamplers()) {
      if (!used.has(sampler)) {
        sampler.dispose();
        dropped += 1;
      }
    }
  }
  return dropped;
}

async function finish(
  doc,
  method,
  {
    quantizeGeometry = false,
    keyframeTolerance = 0,
    precision = [],
    simplifyRatio = 1,
    simplifyError = 0.001,
    dropTangents = false,
  } = {},
) {
  for (const ext of doc.getRoot().listExtensionsUsed()) if (ext instanceof KHRDracoMeshCompression) ext.dispose();
  const channels = dropConstantChannels(doc);
  const tangents = dropUnusedTangents(doc);
  console.log(`  ${channels} constant animation channels dropped, ${tangents} unused tangent sets dropped`);
  const samplers = dropUnusedSamplers(doc);
  console.log(`  ${samplers} unused animation samplers dropped`);
  if (keyframeTolerance > 0)
    console.log(
      `  keyframes at 1/2 within ${keyframeTolerance} deg: ${JSON.stringify(thinKeyframes(doc, 2, keyframeTolerance))}`,
    );
  if (OPT.roundNodes) roundNodeTransforms(doc);
  const steps = [];
  if (OPT.resample) steps.push(resample());
  steps.push(dedup(), prune({ keepAttributes: true }));
  if (quantizeGeometry) steps.push(quantize({ quantizePosition: OPT.positionBits ?? 14, quantizeTexcoord: 12 }));
  await doc.transform(...steps);
  if (OPT.tidy) console.log(`  tidy: ${JSON.stringify(tidyAttributes(doc))}`);
  if (simplifyRatio < 1) {
    await MeshoptSimplifier.ready;
    const before = doc
      .getRoot()
      .listMeshes()
      .map((m) => m.listPrimitives()[0].getIndices()?.getCount() / 3);
    await doc.transform(
      weld(),
      simplify({ simplifier: MeshoptSimplifier, ratio: simplifyRatio, error: simplifyError, lockBorder: true }),
    );
    const after = doc
      .getRoot()
      .listMeshes()
      .map((m) => m.listPrimitives()[0].getIndices()?.getCount() / 3);
    console.log(
      `  simplified (ratio ${simplifyRatio}, error ${simplifyError} of the mesh extent): triangles ${before.join('+')} -> ${after.join('+')}`,
    );
  }
  // Vertex-cache and fetch order (meshoptimizer): needed after simplification, which leaves the buffers unordered.
  if (OPT.reorder || simplifyRatio < 1)
    await doc.transform(reorder({ encoder: MeshoptEncoder }), prune({ keepAttributes: true }));
  if (dropTangents) {
    let n = 0;
    for (const mesh of doc.getRoot().listMeshes())
      for (const prim of mesh.listPrimitives())
        if (prim.getAttribute('TANGENT')) {
          prim.setAttribute('TANGENT', null);
          n += 1;
        }
    console.log(`  ${n} tangent sets dropped (three.js derives the tangent frame per pixel)`);
  }
  for (const [semantic, bits] of precision)
    console.log(`  ${reducePrecision(doc, semantic, bits)} ${semantic} accessors at ${bits} bits`);
  // Attributes removed above leave their accessors behind: prune again so none is written.
  await doc.transform(prune({ keepAttributes: true }));
  doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method });
  return io.writeBinary(doc);
}

/**
 * Resize every texture to the largest size any material using it asks for: `sizes` maps a material-name pattern to a
 * size, first match wins, `fallback` otherwise. WebP throughout (the files already were).
 */
async function resizeTextures(doc, sizes, fallback, { quality = 85, qualityBySize = {}, qualityBySlot = {}, bySlot } = {}) {
  const want = new Map();
  for (const material of doc.getRoot().listMaterials()) {
    const size = sizes.find(([pattern]) => pattern.test(material.getName()))?.[1] ?? fallback;
    const slots = {
      baseColor: material.getBaseColorTexture(),
      normal: material.getNormalTexture(),
      metallicRoughness: material.getMetallicRoughnessTexture(),
      occlusion: material.getOcclusionTexture(),
      emissive: material.getEmissiveTexture(),
      // The cornea's transmission mask (KHR_materials_transmission) was left at 1024 px: 5.6 MB of GPU memory.
      transmission: material.getExtension('KHR_materials_transmission')?.getTransmissionTexture() ?? null,
    };
    for (const [slot, texture] of Object.entries(slots)) {
      if (!texture) continue;
      const slotSize = Math.max(want.get(texture)?.size ?? 0, bySlot?.[slot] ?? size);
      const q = Math.max(want.get(texture)?.q ?? 0, qualityBySlot[slot] ?? qualityBySize[slotSize] ?? quality);
      want.set(texture, { size: slotSize, q });
    }
  }
  if (OPT.format === 'avif' && OPT.matchSsim) {
    // Equal quality, measured: each texture becomes the smallest AVIF whose SSIM against a lossless resize is at least
    // that of the WebP the pipeline used to ship (quality `q`), found by bisection over AVIF quality 30-80.
    doc.createExtension(EXTTextureAVIF).setRequired(true);
    const log = [];
    for (const [texture, { size, q }] of want) {
      const base = sharp(Buffer.from(texture.getImage())).resize(size, size, { fit: 'inside', withoutEnlargement: true });
      const ref = await base.clone().png().toBuffer();
      const target = ssim(
        ref,
        await sharp(await base.clone().webp({ quality: q }).toBuffer())
          .png()
          .toBuffer(),
      );
      let lo = 30;
      let hi = 80;
      let best = await base.clone().avif({ quality: hi, effort: 6 }).toBuffer();
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const candidate = await base.clone().avif({ quality: mid, effort: 6 }).toBuffer();
        if (ssim(ref, await sharp(candidate).png().toBuffer()) >= target) {
          best = candidate;
          hi = mid - 1;
        } else lo = mid + 1;
      }
      texture.setImage(new Uint8Array(best)).setMimeType('image/avif').setURI('');
      log.push(`${size}:${best.length}`);
    }
    const webpLeft = doc
      .getRoot()
      .listTextures()
      .some((t) => t.getMimeType() === 'image/webp');
    if (!webpLeft)
      for (const ext of doc.getRoot().listExtensionsUsed()) if (ext.extensionName === 'EXT_texture_webp') ext.dispose();
    console.log(`  textures matched by SSIM: ${log.join(' ')}`);
    return [...want.values()].map(({ size }) => size);
  }
  for (const [texture, { size, q }] of want) texture.setName(`s${size}q${q}:${texture.getName()}`);
  for (const key of new Set([...want.values()].map(({ size, q }) => `${size}q${q}`))) {
    const [size, q] = key.split('q').map(Number);
    await doc.transform(
      textureCompress({
        encoder: sharp,
        targetFormat: OPT.format,
        resize: [size, size],
        quality: q,
        pattern: new RegExp(`^s${key}:`),
      }),
    );
  }
  for (const texture of want.keys()) texture.setName(texture.getName().replace(/^s\d+q\d+:/, ''));
  return [...want.values()].map(({ size }) => size);
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
    if (/c或nea/.test(material.getName()) && !OPT.corneaTransmission) {
      // The cornea without transmission (opt-in only). PERF-14's first pass shipped this at alpha 0.3, and the second
      // pass's close-up renders showed it clouds the iris grey; at low alpha the sclera turns dark instead, because
      // only the transmissive cornea re-shows the eyeball under the eye's transparent layers. Kept off by default.
      material.setExtension('KHR_materials_transmission', null);
      material.setAlphaMode('BLEND');
      const [r, g, b] = material.getBaseColorFactor();
      material.setBaseColorFactor([r, g, b, OPT.corneaAlpha]);
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
  const sizes = await resizeTextures(doc, TWIN_TEXTURES, 512, {
    quality: OPT.twinQuality,
    qualityBySize: OPT.twinQualityBySize,
  });
  console.log(`twin: ${targets} morph targets removed; textures ${sizes.sort((a, b) => b - a).join(' ')} px`);
  // FILTER keeps the file's existing quantization and node transforms: AnimationGroupM0 builds the anatomy view from
  // this file's geometries and skeletons by name, so nothing structural may move.
  return finish(doc, EXTMeshoptCompression.EncoderMethod.FILTER, {
    precision: OPT.twinPrecision ?? [],
    quantizeGeometry: OPT.twinQuantize,
    keyframeTolerance: OPT.twinKeyTol ?? 0,
    dropTangents: OPT.twinDropTangents ?? false,
  });
}

async function jellyfish(file) {
  const doc = await io.read(file);
  // Colour and glow keep 1024 px; the normal and roughness maps of a translucent body read the same at 512.
  const sizes = await resizeTextures(doc, [], 1024, {
    quality: OPT.jellyQuality,
    qualityBySlot: OPT.jellyQualityBySlot ?? {},
    bySlot: { normal: 512, metallicRoughness: 512 },
  });
  console.log(`jellyfish: textures ${sizes.join(' ')} px`);
  // gltfpack was tried as the last step (it quantizes the float keyframes, about 550 kB smaller) but drops the second
  // and third texture-coordinate sets and the mesh node names that Animal2Model looks up (JF_skin_in, JF_skin_out),
  // which broke the look; glTF Transform keeps both.
  return finish(doc, EXTMeshoptCompression.EncoderMethod.FILTER, {
    quantizeGeometry: OPT.jellyQuantize,
    keyframeTolerance: OPT.jellyKeyTol ?? 0,
    simplifyRatio: OPT.jellySimplify ?? 1,
    simplifyError: OPT.jellySimplifyError ?? 0.001,
  });
}

/**
 * The Digital Twin's environment (EnvironmentGroup): a 1024x512 Radiance HDR from resources.id.life (772 kB, plain
 * HTTP/1.1 there), seen only as a blurred cube map at 45 % opacity. Decoded with three.js's own RGBELoader, box-filtered
 * 4x4 to 256x128 and written back as RGBE (flat scanlines, which RGBELoader reads), served with the models.
 */
async function environment(file) {
  const fromRepo = createRequire(join(repo, 'package.json'));
  const THREE = await import(fromRepo.resolve('three'));
  const { RGBELoader } = await import(fromRepo.resolve('three/examples/jsm/loaders/RGBELoader.js'));
  const loader = new RGBELoader().setDataType(THREE.FloatType);
  const bytes = readFileSync(file);
  const hdr = loader.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  const f = 4;
  const w = hdr.width / f;
  const h = hdr.height / f;
  const header = Buffer.from(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${h} +X ${w}\n`, 'latin1');
  const pixels = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const rgb = [0, 0, 0];
      for (let dy = 0; dy < f; dy += 1) {
        for (let dx = 0; dx < f; dx += 1) {
          const i = ((y * f + dy) * hdr.width + (x * f + dx)) * 4;
          for (let c = 0; c < 3; c += 1) rgb[c] += hdr.data[i + c] / (f * f);
        }
      }
      const v = Math.max(...rgb);
      const o = (y * w + x) * 4;
      if (v < 1e-32) continue;
      const e = Math.ceil(Math.log2(v) + 1e-9);
      const scale = 256 / 2 ** e;
      pixels[o] = Math.min(255, Math.floor(rgb[0] * scale));
      pixels[o + 1] = Math.min(255, Math.floor(rgb[1] * scale));
      pixels[o + 2] = Math.min(255, Math.floor(rgb[2] * scale));
      pixels[o + 3] = e + 128;
    }
  }
  console.log(`environment: ${hdr.width}x${hdr.height} -> ${w}x${h}`);
  return Buffer.concat([header, pixels]);
}

const hashed = (name, bytes, ext = 'glb') => `${name}.${createHash('sha256').update(bytes).digest('hex').slice(0, 10)}.${ext}`;

for (const old of readdirSync(modelsDir)) rmSync(join(modelsDir, old));
const manifest = {};
const write = (key, name, bytes, ext) => {
  const out = hashed(name, bytes, ext);
  writeFileSync(join(modelsDir, out), bytes);
  manifest[key] = `/models/${out}`;
  console.log(`${key}: /models/${out} ${bytes.length} B`);
};
write('twin', 'twin', await twin(join(sourceDir, 'test-v3.glb')));
write('jellyfish', 'jellyfish', await jellyfish(join(sourceDir, 'animal2_v2.glb')));
const hero = readFileSync(join(sourceDir, 'logo_v2.glb'));
write('hero', 'hero', hero); // unchanged bytes, hashed name
write('environment', 'twin-environment', await environment(join(sourceDir, 'neutral.hdr')), 'hdr');
writeFileSync(join(repo, 'src/components/gl/models-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
