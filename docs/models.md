# 3D models (PERF-14)

Every file under `public/models` comes out of `scripts/optimize-models.mjs` with a content-hashed name, so it can be
served immutable for a year (`vercel.json`); the code finds it through `src/components/gl/models-manifest.json`.
Re-run the script (its header has the command) whenever a source model changes; the sources are the pre-pipeline
originals in git history (`git show 3be6cc3:public/models/<name>`). Full `gltf-transform inspect` reports:
`docs/models/inspect-*.md`.

| Model                                     | Before                                                                  | After                                                                                       | What the pipeline does                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| twin (Digital Twin avatar, `test-v3.glb`) | 5,214 kB, 1,403 morph targets, 31 textures (161 MB GPU)                 | 2,170 kB, 0 morph targets, 25 textures (30 MB GPU)                                          | removes the unused morph targets; cornea transmission becomes alpha 0.3 (no second scene pass); drops 406 animation channels that only hold a node at rest; drops tangents where there is no normal map; textures by part: hair 1024, skin and clothes 512, eyes, eye occlusion, tear lines, corneas, nails and mouth 256 (WebP); Meshopt with the FILTER method (keeps the quantization and node structure the anatomy view, `AnimationGroupM0`, builds on) |
| jellyfish (Connect, `animal2_v2.glb`)     | 2,823 kB, Draco, 1,302 animation channels, 2048 px textures (57 MB GPU) | 1,676 kB, Meshopt, 448 channels, colour and glow 1024, normal and roughness 512 (14 MB GPU) | drops 854 channels that only hold a node at rest; Draco to Meshopt (FILTER); keeps every vertex attribute (its second and third UV sets matter: pruning them broke the look)                                                                                                                                                                                                                                                                                 |
| hero (dragon, `logo_v2.glb`)              | 90 kB, Meshopt                                                          | 90 kB, same bytes                                                                           | hashed name only (`scripts/encode-hero-model.mjs` made it)                                                                                                                                                                                                                                                                                                                                                                                                   |

Deleted as unused: `logo.glb`, `logo_v1.glb` (the hero's Draco source, kept in git history) and `geo.min.glb`. No
first-party model uses Draco any more; the decoder in `public/assets/draco` stays for the anatomy models on
resources.id.life, which this repository does not host.

Budgets (plan): twin at most 1.5 MB and 40 MB of GPU textures, jellyfish at most 700 kB. Met: no morph targets, no
Draco, hashed names, twin GPU textures 30 MB. Not met: twin 2.2 MB (most of it is the hair and body geometry, 1.25 MB
after Meshopt; reaching 1.5 MB needs mesh simplification or KTX2 textures, both visible changes to sign off), jellyfish
1.68 MB (most of it float animation keyframes: gltfpack quantizes them, about 550 kB less, but it also drops the
second and third UV sets and the mesh node names the Connect code looks up, so it is not used). KTX2 (Basis) textures were not adopted: they cut GPU memory but
usually download more than WebP, a trade-off for device tests.
