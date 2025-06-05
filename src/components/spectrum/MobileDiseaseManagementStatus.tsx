import { FC, useMemo, useState } from 'react';
import { DataTable } from '../common/Table/data-table';
import { diseaseManagementStatusItems, DiseaseManagementStatusItemType } from '@/constants/disease-management';
import { ArrowSVG } from '../svg';
import FileSVG from '@/../public/svgs/file.svg?component';
import DotCount from './DotCount';

interface DiseaseManagementStatusProps {
  onBack: () => void;
}

const DiseaseManagementStatusItem: FC<DiseaseManagementStatusItemType> = ({ img, title, counts, data, columns, pdf }) => {
  const [showAmount, setShowAmount] = useState(4);

  const showedData = useMemo(() => data.slice(0, showAmount), [data, showAmount]);

  return (
    <div className="flex w-full flex-col items-center font-semibold text-white">
      <img src={img} alt="" className="mb-5 h-[13.6875rem] w-[14.8125rem]" />
      <span className="mb-3 text-base leading-5">{title}</span>
      <div className="mb-7 flex space-x-8 text-xl leading-5">
        <DotCount className="h-[3px] w-[3px] bg-green-500">{counts[0]}</DotCount>
        <DotCount className="h-[3px] w-[3px] bg-red-500">{counts[1]}</DotCount>
      </div>
      <a
        href={pdf}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="corner-button-top relative flex items-center gap-1 p-2 text-xs font-medium"
      >
        <FileSVG />
        <span>Download CSV</span>
      </a>
      <DataTable
        columns={columns}
        data={showedData}
        className="w-full"
        tableClassName="text-xs border-none"
        headerClass="bg-transparent border-none [&_th]:text-white [&_th]:font-semibold [&_th:last-child]:text-left"
        headerRowClass="border-none bg-[#191919] top-0"
        bodyClass="bg-transparent [&_td:last-child]:text-left pt-1"
        rowClass="border-none bg-transparent hover:bg-white/5"
        cellClass="font-normal pr-2 font-light truncate"
        stickyHeader={true}
      />
      <div className="p-2.5 text-center">
        <span className="cursor-pointer font-normal text-blue" onClick={() => setShowAmount((amount) => amount + 4)}>
          See More
        </span>
      </div>
    </div>
  );
};

const MobileDiseaseManagementStatus: FC<DiseaseManagementStatusProps> = ({ onBack }) => {
  return (
    <div className="relative flex flex-col space-y-7.5 px-5 pt-[5.1875rem]">
      {diseaseManagementStatusItems.map((item) => (
        <DiseaseManagementStatusItem key={item.title} {...item} />
      ))}

      <button
        onClick={onBack}
        className="absolute left-4 top-0 flex items-center gap-1 rounded-md fill-white text-base font-semibold text-white"
      >
        <ArrowSVG className="w-4 rotate-90" />
        <span>Back</span>
      </button>
    </div>
  );
};

export default MobileDiseaseManagementStatus;
