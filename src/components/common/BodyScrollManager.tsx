'use client';

import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { showDiseaseManagementContentAtom } from '@/atoms/spectrum';

export default function BodyScrollManager() {
  const isShowingDiseaseManagement = useAtomValue(showDiseaseManagementContentAtom);

  useEffect(() => {
    const htmlElement = document.documentElement;

    if (isShowingDiseaseManagement) {
      htmlElement.classList.add('hide-scrollbar');
    } else {
      htmlElement.classList.remove('hide-scrollbar');
    }

    return () => {
      htmlElement.classList.remove('hide-scrollbar');
    };
  }, [isShowingDiseaseManagement]);

  return null;
}
