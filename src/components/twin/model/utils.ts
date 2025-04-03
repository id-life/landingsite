import * as THREE from 'three';
import { RefObject } from 'react';

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

type ComponentMethod = (...args: any[]) => any;

type ComponentWithMethods = {
  [key: string]: ComponentMethod;
};

export const pollComponentMethod = <T extends ComponentWithMethods>(
  componentRef: any,
  methodName: keyof T,
  args: any[] = [],
  maxAttempts: number = 10,
  interval: number = 100,
): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    let attempts = 0;

    const tryExecute = (): boolean => {
      if (componentRef.current && typeof componentRef.current[methodName] === 'function') {
        const result = componentRef.current[methodName](...args);
        resolve(result);
        return true;
      }

      attempts++;

      if (attempts >= maxAttempts) {
        console.log(`Failed to execute ${String(methodName)} after ${maxAttempts} attempts`);
        return true;
      }

      return false;
    };

    if (!tryExecute()) {
      const intervalId = setInterval(() => {
        if (tryExecute()) {
          clearInterval(intervalId);
        }
      }, interval);
    }
  });
};
