import { NAV_LIST } from '@/components/nav/nav';
import ProductSVG from '@/components/svg/ProductSVG';
import ScienceSVG from '@/components/svg/ScienceSVG';
import LiteratureSVG from '@/components/svg/LiteratureSVG';
import ReplicationSVG from '@/components/svg/ReplicationSVG';

export default function Insight() {
  return (
    <div
      // id={NAV_LIST[3].id}
      className="mt-[16.625rem] p-12 mobile:mt-56 mobile:px-0 mobile:pt-9"
    >
      <h2 className="page-title">Immortal Insight</h2>
      <p className={'font-migrena text-2xl/12 font-bold uppercase mobile:mt-1.5 mobile:text-sm/5 mobile:capitalize'}>
        Influence-centric and reputation-centric
      </p>
      <div className="mt-12 grid w-205 grid-cols-2 gap-5 mobile:mt-6 mobile:w-[17.375rem] mobile:grid-cols-1 mobile:gap-4">
        <LiteratureSVG />
        <ScienceSVG />
        <ReplicationSVG />
        <ProductSVG />
      </div>
    </div>
  );
}
