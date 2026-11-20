'use client';

import { FC, useMemo, useState } from 'react';
import FileSVG from '@/../public/svgs/file.svg?component';
import DotCount from '@/components/disease-management/DotCount';
import { DataTable } from '@/components/common/Table/data-table';
import { DiseaseManagementStatusItemType } from '@/constants/disease-management';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { useFittedTapArea } from '@/hooks/useFittedTapArea';

/**
 * One disease table with its dot picture and counts, one component for phones and wider windows (RWD-02; it was
 * DiseaseManagementStatusItem and MobileDiseaseManagementStatusItem, both rendered and one hidden by CSS). Sizes
 * follow the phone query in CSS (`mobile:`), so the first paint is right before hydration. Real differences on a
 * phone: a smaller picture, the CSV link centred, a narrower table whose cells are cut at 30 % of the window, and
 * four rows at a time with a See More button (the table renders only after mount, so the row count can come from
 * the device profile without a flash).
 *
 * Text at the original's sizes (the owner's rule on font sizes): its own size classes, as on branch main.
 */
export const DiseaseManagementStatusItem: FC<DiseaseManagementStatusItemType> = ({
  img,
  title,
  counts,
  data,
  columns,
  pdf,
}) => {
  const phone = useDeviceProfile()?.tree === 'phone';
  const csvRef = useFittedTapArea<HTMLAnchorElement>();
  const [showAmount, setShowAmount] = useState(4);
  const rows = useMemo(() => (phone ? data.slice(0, showAmount) : data), [phone, data, showAmount]);

  // The PDF link is a plain <a download>: GA4 enhanced measurement records it as file_download (DATA-11).

  return (
    <div className="flex w-full flex-col items-center font-semibold text-white">
      <div className="mb-[3.125rem] flex h-[20.9rem] w-[20.9rem] flex-shrink-0 items-center justify-center mobile:mb-5 mobile:h-[13.6875rem] mobile:w-[14.8125rem]">
        <img src={img} alt={title} className="block h-full w-full object-cover" />
      </div>
      <span className="mb-4 text-center text-xl leading-6 mobile:mb-3 mobile:text-base mobile:leading-5">{title}</span>
      <div className="mb-1 flex space-x-8 text-2xl leading-7 mobile:mb-7 mobile:text-xl mobile:leading-5">
        <DotCount className="bg-data-ok mobile:size-[3px]">{counts[0]}</DotCount>
        <DotCount className="bg-accent mobile:size-[3px]">{counts[1]}</DotCount>
      </div>
      <a
        href={pdf}
        download
        target="_blank"
        rel="noopener noreferrer"
        ref={csvRef}
        className="corner-button-top relative ml-auto flex items-center gap-1 px-1.5 py-2 text-xs font-medium mobile:ml-0 mobile:p-2"
      >
        <FileSVG />
        <span>Download CSV</span>
        {/* The hit area grows towards 44 px on touch screens (RWD-06) into space that is nobody's (useFittedTapArea),
            while the bracketed box, and its corners, keep the original's size. The table's header row starts right
            below the link and is drawn over anything there, so the whole growth goes upwards, where the page is
            free; raising the link above the header instead would change how the page is drawn. */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[calc(-1*var(--tap-left,0px))] right-[calc(-1*var(--tap-right,0px))] top-[calc(-1*var(--tap-up,0px))] hidden coarse:block"
        />
      </a>
      {phone ? (
        <DataTable
          columns={columns}
          data={rows}
          className="w-full"
          tableClassName="border-none"
          headerClass="bg-transparent border-none [&_th]:text-white [&_th]:font-semibold [&_th:last-child]:text-left"
          headerRowClass="border-none bg-white/10 backdrop-blur top-0 [&_th]:text-xs truncate max-w-[30svw]"
          bodyClass="bg-transparent [&_td:last-child]:text-left [&_td:first-child]:max-w-25 [&_td:first-child]:truncate [&_td:first-child]:pl-5 pt-1"
          rowClass="border-none bg-transparent hover:bg-white/5"
          cellClass="font-normal text-xs font-light truncate pr-5 py-2.5 max-w-[30svw]"
        />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          className="w-full table-fixed overflow-visible"
          tableClassName="text-xs border-none"
          headerClass="bg-transparent border-none [&_th]:text-white [&_th]:font-semibold [&_th:last-child]:text-left"
          headerRowClass="border-none bg-white/10 top-0 backdrop-blur"
          bodyClass="bg-transparent [&_td:last-child]:text-left [&_td:first-child]:max-w-[10rem] [&_td:first-child]:pl-[1.25rem] [&_td:last-child]:max-w-[20rem] pt-1"
          rowClass="border-none bg-transparent hover:bg-white/5"
          cellClass="font-normal pr-5 truncate"
        />
      )}
      {phone && showAmount < data.length && (
        // A real button, 44 px tall on a touch screen (RWD-06); it was a span with a click handler.
        <button
          type="button"
          className="flex items-center justify-center p-2.5 text-xs font-normal text-data-sky tap"
          onClick={() => setShowAmount((amount) => amount + 4)}
        >
          See More
        </button>
      )}
    </div>
  );
};
