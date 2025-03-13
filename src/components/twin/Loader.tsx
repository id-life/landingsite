'use client';

import { Html } from '@react-three/drei';

export default function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-2">
        <div id="loader-container">
          <svg className="h-18 w-24" viewBox="0 0 64 48">
            <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
            <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
          </svg>
        </div>
      </div>
    </Html>
  );
}
