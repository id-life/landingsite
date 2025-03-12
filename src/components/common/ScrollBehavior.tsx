'use client';

import { useEffect } from 'react';

export default function ScrollBehavior() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
}
