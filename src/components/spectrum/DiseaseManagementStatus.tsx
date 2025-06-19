import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import { DataTable } from '../common/Table/data-table';
import { diseaseManagementStatusItems, DiseaseManagementStatusItemType } from '@/constants/disease-management';
import FileSVG from '@/../public/svgs/file.svg?component';
import LogoSVG from '@/../public/svgs/logo-monochrome.svg?component';
import DotCount from './DotCount';
import BackButton from './BackButton';

interface DiseaseManagementStatusProps {
  onBack: () => void;
}

const DiseaseManagementStatusItem: FC<DiseaseManagementStatusItemType> = ({ img, title, counts, data, columns, pdf }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="flex w-full flex-col items-center font-semibold text-white">
      <div className="mb-[3.125rem] flex h-[20.9rem] w-[20.9rem] flex-shrink-0 items-center justify-center">
        {isImageLoading && <LogoSVG className="w-[13rem] animate-pulse text-[#1c1c1c]" />}
        <img
          src={img}
          alt={title}
          className={`h-full w-full object-cover ${isImageLoading ? 'hidden' : 'block'}`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />
      </div>
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

const DiseaseManagementStatus: FC<DiseaseManagementStatusProps> = ({ onBack }) => {
  return (
    <>
      <div className="flex h-screen flex-col px-32 pb-[10rem] pt-[9.5625rem]">
        <div
          className="flex flex-1 space-x-15 overflow-y-auto"
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {diseaseManagementStatusItems.map((item) => (
            <DiseaseManagementStatusItem key={item.title} {...item} />
          ))}
        </div>
      </div>
      {createPortal(
        <BackButton onClick={onBack} className="fixed bottom-25 left-1/2 -translate-x-1/2 mobile:bottom-20" />,
        document.body,
      )}
    </>
  );
};

export default DiseaseManagementStatus;
