// components/spectrum/DiseaseManagementContent.tsx (or a more suitable path)
'use client';

import { showDiseaseManagementContentAtom } from '@/atoms/spectrum';
import { useSetAtom } from 'jotai';

export default function DiseaseManagementContent() {
  const setShowDiseaseManagementContent = useSetAtom(showDiseaseManagementContentAtom);

  const handleBack = () => {
    setShowDiseaseManagementContent(false);
  };

  return (
    <div className="page-container flex h-full flex-col items-center justify-center text-white">
      <button
        onClick={handleBack}
        className="absolute left-10 top-28 z-20 rounded bg-gray-700 px-4 py-2 font-bold text-white hover:bg-gray-600 mobile:left-5 mobile:top-20"
      >
        Back to Spectrum
      </button>
      <div className="text-center">
        <h2 className="mb-8 text-4xl font-bold mobile:text-2xl">Disease Management & Cure Status</h2>
        <div className="mx-auto max-w-3xl text-left mobile:px-4">
          <p className="mb-4">
            Welcome to the Disease Management & Cure Status section. Here we provide insights into the latest advancements...
          </p>
          <p className="mb-4">[Your content here - text, images, lists, etc.]</p>
          <ul className="mb-4 list-inside list-disc">
            <li>Topic 1: Current research on [Disease A]</li>
            <li>Topic 2: Breakthroughs in [Treatment B]</li>
            <li>Topic 3: Future outlook for [Condition C]</li>
          </ul>
          <p>For more detailed information, please refer to our whitepapers or contact our research team.</p>
        </div>
      </div>
    </div>
  );
}
