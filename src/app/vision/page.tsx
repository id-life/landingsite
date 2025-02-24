'use client';

import Vision from '@/app/vision/Vision';
import VisionWrapper from '@/components/gl/VisionWrapper';
import { useIsMobile } from '@/hooks/useIsMobile';
import MobileVision from './_components/MobileVision';

export default function VisionPage() {
  const isMobile = useIsMobile();
  return (
    <>
      <VisionWrapper />
      <div id="wrapper">
        <div id="content">{isMobile ? <MobileVision /> : <Vision />}</div>
      </div>
    </>
  );
}
