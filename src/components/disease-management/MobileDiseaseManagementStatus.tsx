import { FC, useMemo, useState } from 'react';
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
  const [showAmount, setShowAmount] = useState(4);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const showedData = useMemo(() => data.slice(0, showAmount), [data, showAmount]);

  return (
    <div className="flex w-full flex-col items-center font-semibold text-white">
      <div className="mb-5 flex h-[13.6875rem] w-[14.8125rem] flex-shrink-0 items-center justify-center">
        {isImageLoading && <LogoSVG className="w-[13rem] animate-pulse text-[#1c1c1c]" />}
        <img
          src={img}
          alt={title}
          className={`h-full w-full object-cover ${isImageLoading ? 'hidden' : 'block'}`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />
      </div>
      <span className="mb-3 text-center text-base leading-5">{title}</span>
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
        tableClassName="border-none"
        headerClass="bg-transparent border-none [&_th]:text-white [&_th]:font-semibold [&_th:last-child]:text-left"
        headerRowClass="border-none bg-white/10 backdrop-blur top-0 [&_th]:text-xs truncate max-w-[30svw]"
        bodyClass="bg-transparent [&_td:last-child]:text-left [&_td:first-child]:max-w-25 [&_td:first-child]:truncate [&_td:first-child]:pl-5 pt-1"
        rowClass="border-none bg-transparent hover:bg-white/5"
        cellClass="font-normal text-xs font-light truncate pr-5 py-2.5 max-w-[30svw]"
      />
      {showAmount < data.length && (
        <div className="p-2.5 text-center">
          <span className="cursor-pointer text-xs font-normal text-blue" onClick={() => setShowAmount((amount) => amount + 4)}>
            See More
          </span>
        </div>
      )}
    </div>
  );
};

const MobileDiseaseManagementStatus: FC<DiseaseManagementStatusProps> = ({ onBack }) => {
  return (
    <div className="flex h-screen flex-col space-y-6 px-5 pb-[12rem] pt-[5.1875rem]">
      <div
        className="hide-scrollbar flex flex-1 flex-col space-y-7.5 overflow-y-auto"
        onWheel={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {diseaseManagementStatusItems.map((item) => (
          <DiseaseManagementStatusItem key={item.title} {...item} />
        ))}
      </div>
      <BackButton onClick={onBack} className="fixed bottom-8.5 left-1/2 z-10 -translate-x-1/2" />
    </div>
  );
};

export default MobileDiseaseManagementStatus;
