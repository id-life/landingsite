# 3D models (PERF-14)

Every file under `public/models` comes out of `scripts/optimize-models.mjs` with a content-hashed name, so it can be
served immutable for a year (`vercel.json`); the code finds it through `src/components/gl/models-manifest.json`.
Re-run the script (its header has the command) whenever a source model changes; the sources are the pre-pipeline
originals in git history (`git show 3be6cc3:public/models/<name>`). Full `gltf-transform inspect` reports:
`docs/models/inspect-*.md`. Sizes: kB = 1,000 bytes, KiB = 1,024 bytes; GPU memory is `gltf-transform inspect`'s
gpuSize (RGBA8 with mipmaps).

| Model                                     | Original                                  | First pass            | Now (second pass)                                         |
| ----------------------------------------- | ----------------------------------------- | --------------------- | --------------------------------------------------------- |
| twin (Digital Twin avatar, `test-v3.glb`) | 5,214 kB, 1,403 morph targets, 161 MB GPU | 2,170 kB, 30.1 MB GPU | **1,529,580 B (1,494 KiB), 0 morph targets, 36.7 MB GPU** |
| jellyfish (Connect, `animal2_v2.glb`)     | 2,823 kB, Draco, 57 MB GPU                | 1,676 kB, 14.0 MB GPU | **775,528 B (757 KiB), 14.0 MB GPU**                      |
| hero (dragon, `logo_v2.glb`)              | 90 kB, Meshopt                            | same bytes            | same bytes, hashed name                                   |
| twin environment (`neutral.hdr`)          | 772 kB from resources.id.life, 1024x512   |                       | **131,121 B, 256x128, served with the models**            |

## What the pipeline does

Both GLBs: Meshopt with the FILTER method (no Draco), KHR_mesh_quantization, textures as AVIF (EXT_texture_avif).

1. **Animation.** Drops channels that hold a node at its rest value (twin 406, jellyfish 854) and the samplers no
   channel uses (twin 406, jellyfish 854; most of the JSON chunk). Rotation tracks keep every second key where the
   dropped key is reproduced within 1 degree (slerp), and the thinned channels share one time track. Resampling was
   tried and not kept: it wrote one time track per sampler.
2. **Geometry.** Tangents dropped where a material has no normal map (twin, 70 kB); all-white vertex colours dropped;
   float UVs inside [0, 1] stored as 16-bit; jellyfish positions, weights and UVs quantized (it shipped float).
   `prune` keeps every vertex attribute: the jellyfish's second and third UV sets are read by its shaders. Mesh and
   node names are kept (the Connect and anatomy code look them up), which is why gltfpack is not used.
3. **Textures.** Each texture becomes the smallest AVIF whose SSIM against a lossless resize is at least that of the
   WebP the first pass shipped (twin quality 85, jellyfish 80), found by bisection over AVIF quality 30 to 80.
   Twin sizes by material: hair and head skin 1024, eyes 512, body skin and clothes 512, eye occlusion, tear lines,
   corneas (including the transmission mask), nails and mouth 256. Jellyfish: colour and glow 1024, normal and
   roughness 512. KTX2 was not adopted: AVIF downloads less at equal SSIM and the GPU budget is met without it.
4. **Simplification: not used.** Every ratio tried on the jellyfish (0.9, 0.85, 0.75 of the triangles) visibly breaks
   or facets the thin tentacles.

The twin cornea keeps KHR_materials_transmission: the first pass replaced it with alpha 0.3, which clouded the irises
grey (a defect found in pass two by close-up renders) and, at lower alpha, darkens the sclera.

## Budgets

Plan: twin at most 1.5 MB (1,536 KiB) with no morph targets and at most 40 MB of GPU textures; jellyfish at most
700 kB (716,800 B); Meshopt, no Draco, hashed names. **Met, except the jellyfish: 775,528 B, 58,728 B over.** What is
left in it: rotation keyframes 123 kB, JSON 146 kB (438 nodes, 448 channels), geometry 293 kB (positions 76, weights
58, UVs 50, joints 47 (325 joints: cannot be 8-bit), indices 33, normals 30), inverse bind matrices 25 kB, textures
157 kB. The next cuts are each a visible trade: halving every rotation track regardless of error (up to 3.1 degrees,
about 718 KiB) or simplifying the mesh (0.75 of the triangles reaches 693 KiB with faceted tentacles).
