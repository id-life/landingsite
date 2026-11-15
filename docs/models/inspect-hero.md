OVERVIEW
────────────────────────────────────────────
| key | value |
| --- | --- |
| version | 2.0 |
| generator | glTF-Transform v4.2.1 |
| extensionsUsed | EXT_meshopt_compression |
| extensionsRequired | EXT_meshopt_compression |

SCENES
────────────────────────────────────────────
| # | name | rootName | bboxMin | bboxMax | renderVertexCount¹ | uploadVertexCount | uploadNaiveVertexCount |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Scene | logo | -45.31915, -21.29572, -2.61236 | 44.74486, 31.17874, 3.29694 | 19,650 | 5,009 | 5,009 |

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
| 0 | logo.001 | TRIANGLES | 1 | 6,550 | 5,009 | u16 | NORMAL:i8_norm, POSITION:f32, TEXCOORD_0:f32 | 1 | 154.51 KB |

⁴ size estimates GPU memory required by a mesh, in isolation. If accessors are
shared by other mesh primitives, but the meshes themselves are not reused, then
the sum of all mesh sizes will overestimate the asset's total size. See "dedup".

MATERIALS
────────────────────────────────────────────
No materials found.

TEXTURES
────────────────────────────────────────────
No textures found.

ANIMATIONS
────────────────────────────────────────────
No animations found.
