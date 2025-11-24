'use client';

import Clarity from '@microsoft/clarity';

export function WebClarity() {
  // Make sure to add your actual project id instead of "yourProjectId".
  const projectId = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!projectId) return null;

  Clarity.init(projectId);
  Clarity.consent();

  return null;
}
