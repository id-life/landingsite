'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export function WebClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_ID;

  useEffect(() => {
    if (!projectId) return;

    Clarity.init(projectId);
    Clarity.consent();
  }, [projectId]);

  return null;
}
