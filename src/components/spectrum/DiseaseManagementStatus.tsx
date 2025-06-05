import { FC } from 'react';
import { DataTable } from '../common/Table/data-table';
import { diseaseManagementStatusItems, DiseaseManagementStatusItemType } from '@/constants/disease-management';
import { ArrowSVG } from '../svg';
import FileSVG from '@/../public/svgs/file.svg?component';
import DotCount from './DotCount';

interface DiseaseManagementStatusProps {
  onBack: () => void;
}

const DiseaseManagementStatusItem: FC<DiseaseManagementStatusItemType> = ({ img, title, counts, data, columns, pdf }) => {
  return (
    <div className="flex w-full flex-col items-center font-semibold text-white">
      <img src={img} alt="" className="mb-[3.125rem] h-[26.125rem] w-[26.125rem]" />
      <span className="mb-4 text-center text-xl leading-6">{title}</span>
      <div className="mb-1 flex space-x-8 text-2xl leading-7">
        <DotCount className="bg-green-500">{counts[0]}</DotCount>
        <DotCount className="bg-red-500">{counts[1]}</DotCount>
      </div>
      <a
        href={pdf}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="corner-button-top relative ml-auto flex items-center gap-1 p-2 text-xs font-medium"
      >
        <FileSVG />
        <span>Download CSV</span>
      </a>
      <DataTable
        columns={columns}
        data={data}
        className="w-full"
        tableClassName="text-xs border-none"
        headerClass="bg-transparent border-none [&_th]:text-white [&_th]:font-semibold [&_th:last-child]:text-left"
        headerRowClass="border-none bg-white/10 top-0 backdrop-blur"
        bodyClass="bg-transparent [&_td:last-child]:text-left pt-1"
        rowClass="border-none bg-transparent hover:bg-white/5"
        cellClass="font-normal pr-2"
        stickyHeader={true}
      />
    </div>
  );
};

const DiseaseManagementStatus: FC<DiseaseManagementStatusProps> = ({ onBack }) => {
  return (
    <div className="relative flex h-[100svh] space-x-15 px-32 pb-32 pt-[9.5625rem]">
      {diseaseManagementStatusItems.map((item) => (
        <DiseaseManagementStatusItem key={item.title} {...item} />
      ))}

      <button
        onClick={onBack}
        className="absolute left-12 top-[9.5625rem] flex items-center gap-1 rounded-md fill-white text-2xl font-semibold text-white"
      >
        <ArrowSVG className="w-6 rotate-90" />
        <span>Back</span>
      </button>
    </div>
  );
};

export default DiseaseManagementStatus;
