import * as THREE from 'three';

export const changeArrayData = (array: any[], key: string, value: any, index = 0) => {
  if (index >= array.length) return;

  array[index][key] = value;
  array[index].traverse((object: any) => {
    if (object.isMesh) {
      object[key] = value;
    }
  });
  requestAnimationFrame(() => {
    changeArrayData(array, key, value, index + 1);
  });
};

