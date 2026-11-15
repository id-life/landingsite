OVERVIEW
────────────────────────────────────────────
| key | value |
| --- | --- |
| version | 2.0 |
| generator | glTF-Transform v4.2.1 |
| extensionsUsed | EXT_meshopt_compression, EXT_texture_webp, KHR_materials_ior, KHR_materials_specular, KHR_mesh_quantization |
| extensionsRequired | EXT_meshopt_compression, EXT_texture_webp, KHR_mesh_quantization |

SCENES
────────────────────────────────────────────
| # | name | rootName | bboxMin | bboxMax | renderVertexCount¹ | uploadVertexCount | uploadNaiveVertexCount |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Scene | Armature | -0.01, -0.01, -0.01 | 0.01, 0.01, 0.01 | 271,893 | 74,677 | 74,677 |

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
| 0 | Basic_T_shirts.001 | TRIANGLES | 1 | 4,582 | 2,845 | u16 | COLOR_0:u8_norm, JOINTS_0:u8, NORMAL:i8_norm, POSITION:i16_norm, TANGENT:i8_norm, TEXCOORD_0:u16_norm, WEIGHTS_0:u8_norm | 1 | 110 KB |
| 1 | CC_Base_Body.001 | TRIANGLES | 6 | 28,092 | 15,608 | u16 | JOINTS_0:u8, NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32, TEXCOORD_0:u16_norm, WEIGHTS_0:u8_norm | 1 | 541.31 KB |
| 2 | CC_Base_Eye.001 | TRIANGLES | 4 | 1,280 | 756 | u16 | JOINTS_0:u8, NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm, WEIGHTS_0:u8_norm | 1 | 14.77 KB |
| 3 | CC_Base_EyeOcclusion.001 | TRIANGLES | 2 | 288 | 182 | u16 | JOINTS_0:u8, NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm, TEXCOORD_1:u16_norm, WEIGHTS_0:u8_norm | 1 | 5.55 KB |
| 4 | CC_Base_TearLine.001 | TRIANGLES | 2 | 272 | 196 | u16 | JOINTS_0:u8, NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm, WEIGHTS_0:u8_norm | 1 | 4.96 KB |
| 5 | CC_Base_Teeth.001 | TRIANGLES | 2 | 4,842 | 2,899 | u16 | JOINTS_0:u8, NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm, WEIGHTS_0:u8_norm | 1 | 89.93 KB |
| 6 | CC_Base_Tongue.001 | TRIANGLES | 1 | 592 | 331 | u16 | JOINTS_0:u8, NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm, WEIGHTS_0:u8_norm | 1 | 10.5 KB |
| 7 | Layered_Straight_Hair.001 | TRIANGLES | 1 | 40,802 | 45,371 | u16 | COLOR_0:u8_norm, JOINTS_0:u8, NORMAL:i8_norm, POSITION:i16_norm, TANGENT:i8_norm, TEXCOORD_0:u16_norm, WEIGHTS_0:u8_norm | 1 | 1.56 MB |
| 8 | Sport_sneakers.001 | TRIANGLES | 1 | 5,804 | 4,297 | u16 | COLOR_0:u8_norm, JOINTS_0:u8, NORMAL:i8_norm, POSITION:i16_norm, TANGENT:i8_norm, TEXCOORD_0:u16_norm, WEIGHTS_0:u8_norm | 1 | 159.44 KB |
| 9 | Sports_Pants.001 | TRIANGLES | 1 | 4,077 | 2,192 | u16 | JOINTS_0:u8, NORMAL:i8_norm, POSITION:i16_norm, TANGENT:i8_norm, TEXCOORD_0:u16_norm, WEIGHTS_0:u8_norm | 1 | 79.26 KB |

⁴ size estimates GPU memory required by a mesh, in isolation. If accessors are
shared by other mesh primitives, but the meshes themselves are not reused, then
the sum of all mesh sizes will overestimate the asset's total size. See "dedup".

MATERIALS
────────────────────────────────────────────
| # | name | instances | textures | alphaMode | doubleSided |
| --- | --- | --- | --- | --- | --- |
| 0 | 基础tshirts.006b192 | 1 | baseColorTexture, normalTexture | OPAQUE | ✓ |
| 1 | 基本皮肤头.006b177.001 | 1 | baseColorTexture | OPAQUE | ✓ |
| 2 | 基本皮肤身体.006b178.001 | 1 | baseColorTexture | OPAQUE | ✓ |
| 3 | 基本皮肤手臂.006b179.001 | 1 | baseColorTexture | OPAQUE | ✓ |
| 4 | 基本皮肤腿.006b180.001 | 1 | baseColorTexture | OPAQUE | ✓ |
| 5 | 基本指甲.006b181.001 | 1 | baseColorTexture | OPAQUE | ✓ |
| 6 | 基本睫毛.006b182.001 | 1 | baseColorTexture | BLEND | ✓ |
| 7 | 基本眼睛r.006b188 | 1 | baseColorTexture | OPAQUE | ✓ |
| 8 | 基本c或near.006b189 | 1 | baseColorTexture, metallicRoughnessTexture | BLEND | ✓ |
| 9 | 基本眼睛l.006b190 | 1 | baseColorTexture | OPAQUE | ✓ |
| 10 | 基本c或neal.006b191 | 1 | baseColorTexture, metallicRoughnessTexture | BLEND | ✓ |
| 11 | 基本眼部阻塞r.006b193 | 2 | baseColorTexture | BLEND | |
| 12 | 基本分裂线r.006b195 | 2 | | BLEND | |
| 13 | 基本上齿.006b183.001 | 1 | baseColorTexture | OPAQUE | ✓ |
| 14 | 基本下颌.006b184.001 | 1 | baseColorTexture | OPAQUE | ✓ |
| 15 | 基本舌头.006b185.001 | 1 | baseColorTexture | OPAQUE | ✓ |
| 16 | 毛发透明度.023b186 | 1 | baseColorTexture, normalTexture | BLEND | ✓ |
| 17 | sp或tsneakers.006b197 | 1 | baseColorTexture, normalTexture | OPAQUE | ✓ |
| 18 | sp或tspants.006b187 | 1 | baseColorTexture, normalTexture | OPAQUE | ✓ |

TEXTURES
────────────────────────────────────────────
| # | name | uri | slots | instances | mimeType | compression | resolution | size | gpuSize⁵ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 基础tshirts | | normalTexture | 1 | image/webp | | 512x512 | 21.34 KB | 1.4 MB |
| 1 | 基础tshirts | | baseColorTexture | 1 | image/webp | | 512x512 | 5.12 KB | 1.4 MB |
| 2 | 基本皮肤头 | | baseColorTexture | 1 | image/webp | | 512x512 | 9.6 KB | 1.4 MB |
| 3 | 基本皮肤身体 | | baseColorTexture | 1 | image/webp | | 512x512 | 5.65 KB | 1.4 MB |
| 4 | 基本皮肤手臂 | | baseColorTexture | 1 | image/webp | | 512x512 | 8.21 KB | 1.4 MB |
| 5 | 基本皮肤腿 | | baseColorTexture | 1 | image/webp | | 512x512 | 8.11 KB | 1.4 MB |
| 6 | 基本指甲 | | baseColorTexture | 1 | image/webp | | 256x256 | 8.33 KB | 349.52 KB |
| 7 | 基本睫毛-基本睫毛 | | baseColorTexture | 1 | image/webp | | 512x512 | 64.7 KB | 1.4 MB |
| 8 | 基本眼睛r | | baseColorTexture | 1 | image/webp | | 256x256 | 1.13 KB | 349.52 KB |
| 9 | 基本c或near | | baseColorTexture | 1 | image/webp | | 256x256 | 2.68 KB | 349.52 KB |
| 10 | 基本c或near-基本c或near | | metallicRoughnessTexture | 2 | image/webp | | 256x256 | 426 Bytes | 349.52 KB |
| 11 | 基本眼睛l | | baseColorTexture | 1 | image/webp | | 256x256 | 1.15 KB | 349.52 KB |
| 12 | 基本c或neal | | baseColorTexture | 1 | image/webp | | 256x256 | 2.66 KB | 349.52 KB |
| 13 | 基本眼部阻塞r-基本眼部阻塞r | | baseColorTexture | 1 | image/webp | | 256x256 | 4.03 KB | 349.52 KB |
| 14 | 基本上齿 | | baseColorTexture | 1 | image/webp | | 256x256 | 6.83 KB | 349.52 KB |
| 15 | 基本下颌 | | baseColorTexture | 1 | image/webp | | 256x256 | 6.58 KB | 349.52 KB |
| 16 | 基本舌头 | | baseColorTexture | 1 | image/webp | | 256x256 | 3.92 KB | 349.52 KB |
| 17 | EXPORT*BAKE*毛发透明度 | | normalTexture | 1 | image/webp | | 1024x1024 | 36.92 KB | 5.59 MB |
| 18 | 毛发透明度-毛发透明度 | | baseColorTexture | 1 | image/webp | | 1024x1024 | 437.04 KB | 5.59 MB |
| 19 | sp或tsneakers | | normalTexture | 1 | image/webp | | 512x512 | 41.09 KB | 1.4 MB |
| 20 | sp或tsneakers | | baseColorTexture | 1 | image/webp | | 512x512 | 24.7 KB | 1.4 MB |
| 21 | sp或tspants | | normalTexture | 1 | image/webp | | 512x512 | 7.87 KB | 1.4 MB |
| 22 | sp或tspants | | baseColorTexture | 1 | image/webp | | 512x512 | 8.98 KB | 1.4 MB |

⁵ gpuSize estimates minimum VRAM memory allocation. Older devices may require
additional memory for GPU compression formats.

ANIMATIONS
────────────────────────────────────────────
| # | name | channels | samplers | duration | keyframes | size |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | Apose | 101 | 195 | 0 | 390 | 2.32 KB |
| 1 | BicepCurl | 117 | 195 | 6 | 2,625 | 29.79 KB |
| 2 | Idle | 117 | 195 | 4 | 3,125 | 35.9 KB |
| 3 | PullingLever | 117 | 195 | 6 | 4,400 | 50.11 KB |
| 4 | Searching | 117 | 195 | 3 | 3,340 | 34.84 KB |
