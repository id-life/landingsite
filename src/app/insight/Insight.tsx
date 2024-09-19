import { NAV_LIST } from '@/components/nav/nav';
import ProductSVG from '@/components/svg/ProductSVG';
import ScienceSVG from '@/components/svg/ScienceSVG';
import LiteratureSVG from '@/components/svg/LiteratureSVG';
import ReplicationSVG from '@/components/svg/ReplicationSVG';

export default function Insight() {
  return (
    <div id={NAV_LIST[3].id} className="mt-[16.625rem] p-12 mobile:mt-56 mobile:p-0">
      <h2 className="page-title">Immortal Insight </h2>
      <p className="font-migrena text-2xl/12 font-bold uppercase mobile:text-sm/5">Influence-centric and reputation-centric</p>
      <div className="mt-12 grid w-205 grid-cols-2 gap-5 mobile:mt-6 mobile:w-3/4 mobile:grid-cols-1 mobile:gap-2.5">
        <LiteratureSVG />
        <ScienceSVG />
        <ReplicationSVG />
        <ProductSVG />
      </div>
    </div>
  );
}
