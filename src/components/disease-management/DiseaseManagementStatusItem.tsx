import { FC } from 'react';
import FileSVG from '@/../public/svgs/file.svg?component';
import DotCount from '@/components/disease-management/DotCount';
import { DataTable } from '@/components/common/Table/data-table';
import { DiseaseManagementStatusItemType } from '@/constants/disease-management';

export const DiseaseManagementStatusItem: FC<DiseaseManagementStatusItemType> = ({
  img,
  title,
  counts,
  data,
  columns,
  pdf,
}) => {
  // The PDF link is a plain <a download>: GA4 enhanced measurement records it as file_download (DATA-11).

  return (
    <div className="flex w-full flex-col items-center font-semibold text-white mobile:hidden">
      <div className="mb-[3.125rem] flex h-[20.9rem] w-[20.9rem] flex-shrink-0 items-center justify-center">
        <img src={img} alt={title} className="block h-full w-full object-cover" />
      </div>
      <span className="mb-4 text-center text-xl leading-6">{title}</span>
      <div className="mb-1 flex space-x-8 text-2xl leading-7">
        <DotCount className="bg-data-ok">{counts[0]}</DotCount>
        <DotCount className="bg-accent">{counts[1]}</DotCount>
      </div>
      <a
        href={pdf}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="corner-button-top relative ml-auto flex items-center gap-1 p-2 text-xs font-medium tap"
      >
        <FileSVG />
        <span>Download CSV</span>
      </a>
      <DataTable
        columns={columns}
        data={data}
        className="w-full table-fixed overflow-visible"
        tableClassName="text-xs border-none"
        headerClass="bg-transparent border-none [&_th]:text-white [&_th]:font-semibold [&_th:last-child]:text-left"
        headerRowClass="border-none bg-white/10 top-0 backdrop-blur"
        bodyClass="bg-transparent [&_td:last-child]:text-left [&_td:first-child]:max-w-[10rem] [&_td:first-child]:pl-[1.25rem] [&_td:last-child]:max-w-[20rem] pt-1"
        rowClass="border-none bg-transparent hover:bg-white/5"
        cellClass="font-normal pr-5 truncate"
      />
    </div>
  );
};
