'use client';

import React, { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import Value from '@/app/value/Value';
import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import ThreeWrapper from '@/components/gl/ThreeWrapper';

export default function ValuePage() {
  const setCurrentPage = useSetAtom(currentPageAtom);

  useEffect(() => {
    setCurrentPage(NAV_LIST[3]);
  }, [setCurrentPage]);

  return (
    <>
      <ThreeWrapper />
      <div id="wrapper">
        <div id="content">
          <Value />
        </div>
      </div>
    </>
  );
}
