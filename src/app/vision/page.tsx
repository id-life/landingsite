'use client';

import React from 'react';
import Vision from '@/app/vision/Vision';
import VisionWrapper from '@/components/gl/VisionWrapper';

export default function VisionPage() {
  return (
    <>
      <VisionWrapper />
      <div id="wrapper">
        <div id="content">
          <Vision />
        </div>
      </div>
    </>
  );
}
