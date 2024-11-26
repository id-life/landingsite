type Mesh = {
  name: string;
  reflectivity: number;
  anisotropy: number;
};

type AnimalConfig = {
  path: string;
  scale: number;
  animation: number;
  mesh: Mesh[];
};
export const ANIMAL_CONFIG: AnimalConfig[] = [
  {
    path: 'https://cdn.id.life/animal2.glb',
    scale: 1,
    animation: 1,
    mesh: [{ name: 'JF_skin_in', reflectivity: 0.04, anisotropy: 0.5 }],
  },
  {
    path: 'https://cdn.id.life/animal3.glb',
    scale: 1.1,
    animation: 2,
    mesh: [
      { name: 'Object_12', reflectivity: 0.04, anisotropy: 0.5 },
      { name: 'Object_14', reflectivity: 0.1, anisotropy: 0.5 },
    ],
  },
] as const;
