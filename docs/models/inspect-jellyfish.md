OVERVIEW
────────────────────────────────────────────
| key | value |
| --- | --- |
| version | 2.0 |
| generator | glTF-Transform v4.2.1 |
| extensionsUsed | EXT_meshopt_compression, EXT_texture_webp, KHR_materials_ior, KHR_materials_transmission |
| extensionsRequired | EXT_meshopt_compression, EXT_texture_webp |

SCENES
────────────────────────────────────────────
| # | name | rootName | bboxMin | bboxMax | renderVertexCount¹ | uploadVertexCount | uploadNaiveVertexCount |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Scene | Jellyfish_Empty | -14.121, -31.06975, -11.67074 | 17.30899, 14.47402, 16.22755 | 87,072 | 17,488 | 17,488 |

¹ Expected number of vertices processed by the vertex shader for one render
pass, without considering the vertex cache.

² Expected number of vertices uploaded to GPU, assuming each Accessor
is uploaded only once. Actual number uploaded may be higher,
dependent on the implementation and vertex buffer layout.

³ Expected number of vertices uploaded to GPU, assuming each Primitive
is uploaded once, duplicating vertex attributes shared among Primitives.

MESHES
────────────────────────────────────────────
| # | name | mode | meshPrimitives | glPrimitives | vertices | indices | attributes | instances | size¹ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Mesh.005 | TRIANGLES | 1 | 14,512 | 8,746 | u16 | JOINTS_0:u16, NORMAL:i8_norm, POSITION:f32, TEXCOORD_0:f32, TEXCOORD_1:f32, WEIGHTS_0:f32 | 1 | 498.13 KB |
| 1 | Mesh.006 | TRIANGLES | 1 | 14,512 | 8,742 | u16 | JOINTS_0:u16, NORMAL:i8_norm, POSITION:f32, TEXCOORD_0:f32, TEXCOORD_1:f32, TEXCOORD_2:f32, WEIGHTS_0:f32 | 1 | 497.95 KB |

⁴ size estimates GPU memory required by a mesh, in isolation. If accessors are
shared by other mesh primitives, but the meshes themselves are not reused, then
the sum of all mesh sizes will overestimate the asset's total size. See "dedup".

MATERIALS
────────────────────────────────────────────
| # | name | instances | textures | alphaMode | doubleSided |
| --- | --- | --- | --- | --- | --- |
| 0 | Glass | 1 | | BLEND | ✓ |
| 1 | Main material.001 | 1 | baseColorTexture, emissiveTexture, normalTexture, metallicRoughnessTexture | BLEND | ✓ |

TEXTURES
────────────────────────────────────────────
| # | name | uri | slots | instances | mimeType | compression | resolution | size | gpuSize⁵ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Purple_Striped_Jellyfish_emiss | | emissiveTexture | 1 | image/webp | | 1024x1024 | 101.16 KB | 5.59 MB |
| 1 | Normal map_opt | | normalTexture | 1 | image/webp | | 512x512 | 54.08 KB | 1.4 MB |
| 2 | Map_opt | | baseColorTexture | 1 | image/webp | | 1024x1024 | 320.1 KB | 5.59 MB |
| 3 | Roughness map_opt | | metallicRoughnessTexture | 1 | image/webp | | 512x512 | 34.72 KB | 1.4 MB |

⁵ gpuSize estimates minimum VRAM memory allocation. Older devices may require
additional memory for GPU compression formats.

ANIMATIONS
────────────────────────────────────────────
| # | name | channels | samplers | duration | keyframes | size |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | jellyfish|jellyfish|move_1 | 448 | 1,302 | 4 | 41,414 | 419.03 KB |
