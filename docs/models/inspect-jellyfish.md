OVERVIEW
────────────────────────────────────────────
| key | value |
| --- | --- |
| version | 2.0 |
| generator | glTF-Transform v4.2.1 |
| extensionsUsed | EXT_meshopt_compression, EXT_texture_avif, KHR_materials_ior, KHR_materials_transmission, KHR_mesh_quantization |
| extensionsRequired | EXT_meshopt_compression, EXT_texture_avif, KHR_mesh_quantization |

SCENES
────────────────────────────────────────────
| # | name | rootName | bboxMin | bboxMax | renderVertexCount¹ | uploadVertexCount | uploadNaiveVertexCount |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Scene | Jellyfish_Empty | -5.88835, -7.66544, -4.47596 | 4.76456, 7.77154, 4.97982 | 87,072 | 17,488 | 17,488 |

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
| 0 | Mesh.005 | TRIANGLES | 1 | 14,512 | 8,746 | u16 | JOINTS_0:u16, NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm, TEXCOORD_1:u16_norm, WEIGHTS_0:u8_norm | 1 | 305.72 KB |
| 1 | Mesh.006 | TRIANGLES | 1 | 14,512 | 8,742 | u16 | JOINTS_0:u16, NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm, TEXCOORD_1:u16_norm, TEXCOORD_2:u16_norm, WEIGHTS_0:u8_norm | 1 | 305.62 KB |

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
| 0 | Purple_Striped_Jellyfish_emiss | | emissiveTexture | 1 | image/avif | | 1024x1024 | 58.63 KB | 5.59 MB |
| 1 | Normal map_opt | | normalTexture | 1 | image/avif | | 512x512 | 30.76 KB | 1.4 MB |
| 2 | Map_opt | | baseColorTexture | 1 | image/avif | | 1024x1024 | 52.04 KB | 5.59 MB |
| 3 | Roughness map_opt | | metallicRoughnessTexture | 1 | image/avif | | 512x512 | 19.05 KB | 1.4 MB |

⁵ gpuSize estimates minimum VRAM memory allocation. Older devices may require
additional memory for GPU compression formats.

ANIMATIONS
────────────────────────────────────────────
| # | name | channels | samplers | duration | keyframes | size |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | jellyfish|jellyfish|move_1 | 448 | 448 | 4 | 32,414 | 273.89 KB |
