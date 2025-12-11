'use client';

import { NAV_LIST } from '@/components/nav/nav';
import InsightNews from '@/app/insights/_components/InsightNews';

export default function Insights() {
  return (
    <div id={NAV_LIST[5].id} className="page-container insights">
      <div className="grid grid-cols-3 px-32 pt-30">
        <div>
          <h2 className="font-oxanium text-2xl font-semibold uppercase">NEWS & Coverage</h2>
          <div className="mt-9">
            <InsightNews />
            <InsightNews />
            <InsightNews />
            <InsightNews />
          </div>
        </div>
        <div>
          <h2 className="font-oxanium text-2xl uppercase">Talks & Essays</h2>
        </div>
        <div>
          <h2 className="font-oxanium text-2xl uppercase">Podcast</h2>
        </div>
      </div>
    </div>
  );
}
