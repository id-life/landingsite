'use client';

import { NAV_LIST } from '@/components/nav/nav';

export default function Value() {
  return (
    <div id={NAV_LIST[5].id} className="page-container value">
      <div id="value-page1" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
      <div id="value-page2" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
      <div id="value-page3" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
    </div>
  );
}
