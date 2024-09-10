'use client';

import { NAV_LIST } from '@/components/nav/nav';
import LiteratureSVG from '@/components/svg/LiteratureSVG';
import ScienceSVG from '@/../public/svg/insight/science.svg?component';
import ReplicationSVG from '@/../public/svg/insight/replication.svg?component';
import ProductSVG from '@/../public/svg/insight/product.svg?component';

export default function Insight() {
  return (
    <div id={NAV_LIST[2].id} className="page-height mt-37 px-12">
      <h2 className="page-title">Immortal Insight </h2>
      <p className="text-2xl/12 font-migrena font-bold uppercase">Influence-centric and reputation-centric</p>
      <div className="w-205 mt-12 grid grid-cols-2 gap-5">
        <LiteratureSVG />
        <ScienceSVG />
        <ReplicationSVG />
        <ProductSVG />
      </div>
    </div>
  );
}
