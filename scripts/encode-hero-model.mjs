#!/usr/bin/env node
// Re-encode the hero dragon model from Draco to Meshopt (EXT_meshopt_compression, FILTER method, the
// equivalent of `gltfpack -cc`), so the first screen needs no Draco decoder (two requests, ~96 KB on
// the wire and a WASM compile). The FILTER method keeps POSITION as float32 and leaves node transforms
// alone: DragonModel uses the logo mesh's geometry without its node transform, so the QUANTIZE method
// (which moves a dequantization transform onto the node) would draw the dragon at the wrong size.
//
// The glTF Transform packages are not dependencies of the site; install them in a scratch folder and
// run this script from there (they are resolved from the current directory):
//   mkdir /tmp/hero-model && cd /tmp/hero-model && npm init -y && \
//     npm i @gltf-transform/core@4.2.1 @gltf-transform/extensions@4.2.1 @gltf-transform/functions@4.2.1 \
//       meshoptimizer@0.22.0 draco3dgltf@1.5.7
//   node <repo>/scripts/encode-hero-model.mjs <repo>/public/models/logo_v1.glb <repo>/public/models/logo_v2.glb
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const fromCwd = createRequire(join(process.cwd(), 'noop.js'));
const load = (name) => import(fromCwd.resolve(name));
const { NodeIO } = await load('@gltf-transform/core');
const { ALL_EXTENSIONS, EXTMeshoptCompression, KHRDracoMeshCompression } = await load('@gltf-transform/extensions');
const { reorder } = await load('@gltf-transform/functions');
const draco3d = (await load('draco3dgltf')).default;
const { MeshoptEncoder, MeshoptDecoder } = await load('meshoptimizer');

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error('usage: encode-hero-model.mjs <input.glb> <output.glb>');

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'meshopt.encoder': MeshoptEncoder,
  'meshopt.decoder': MeshoptDecoder,
});
const doc = await io.read(input);
for (const ext of doc.getRoot().listExtensionsUsed()) if (ext instanceof KHRDracoMeshCompression) ext.dispose();
await doc.transform(reorder({ encoder: MeshoptEncoder }));
doc
  .createExtension(EXTMeshoptCompression)
  .setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });
await io.write(output, doc);

const glb = readFileSync(output);
const json = JSON.parse(glb.subarray(20, 20 + glb.readUInt32LE(12)).toString());
const position = json.accessors[json.meshes[0].primitives[0].attributes.POSITION];
console.log(
  `${output}: ${glb.length} B, extensionsRequired ${json.extensionsRequired}, POSITION min ${position.min} max ${position.max}`,
);
