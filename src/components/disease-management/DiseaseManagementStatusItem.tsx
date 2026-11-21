'use client';

import { FC, useState } from 'react';
import FileSVG from '@/../public/svgs/file.svg?component';
import DotCount from '@/components/disease-management/DotCount';
import { DataTable } from '@/components/common/Table/data-table';
import { DiseaseManagementStatusItemType } from '@/constants/disease-management';
import { useFittedTapArea } from '@/hooks/useFittedTapArea';

/**
 * One disease table with its dot picture and counts, one component for phones and wider windows (RWD-02; it was
 * DiseaseManagementStatusItem and MobileDiseaseManagementStatusItem, both rendered and one hidden by CSS). Sizes
 * follow the phone query in CSS (`mobile:`, the same query as the phone deck), so the first paint is right before
 * hydration. Real differences on a phone: a smaller picture, the CSV link centred, a narrower table whose cells are cut
 * at 30 % of the window, and four rows at a time with a See More button.
 *
 * CON-14: the table is in the server HTML (every row name of both datasets, which the page draws), so it is one table
 * whose phone look is its `mobile:` classes: each one restates what the phone table's classes gave, and each laptop-only
 * class is reset on a phone. On a phone the rows past the shown count are hidden by CSS from the server render on, by
 * their place in the data, exactly the rows the phone table used to leave out.
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
  const csvRef = useFittedTapArea<HTMLAnchorElement>();
  const [showAmount, setShowAmount] = useState(4);

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
      <DataTable
        renderOnServer
        columns={columns}
        data={data}
        rowClassByIndex={(index) => (index >= showAmount ? 'mobile:hidden' : undefined)}
        className="w-full table-fixed overflow-visible mobile:table-auto mobile:overflow-auto"
        tableClassName="text-xs border-none mobile:text-sm"
        headerClass="bg-transparent border-none [&_th]:text-white [&_th]:font-semibold [&_th:last-child]:text-left"
        headerRowClass="border-none bg-white/10 top-0 backdrop-blur mobile:[&_th]:text-xs mobile:truncate mobile:max-w-[30svw]"
        bodyClass="bg-transparent [&_td:last-child]:text-left [&_td:first-child]:max-w-[10rem] [&_td:first-child]:pl-[1.25rem] [&_td:last-child]:max-w-[20rem] pt-1 mobile:[&_td:first-child]:max-w-25 mobile:[&_td:first-child]:truncate mobile:[&_td:last-child]:max-w-[30svw]"
        rowClass="border-none bg-transparent hover:bg-white/5"
        cellClass="font-normal pr-5 truncate mobile:text-xs mobile:font-light mobile:py-2.5 mobile:max-w-[30svw]"
      />
      {showAmount < data.length && (
        // A real button, 44 px tall on a touch screen (RWD-06); it was a span with a click handler. Phone only.
        <button
          type="button"
          className="hidden items-center justify-center p-2.5 text-xs font-normal text-data-sky tap mobile:flex"
          onClick={() => setShowAmount((amount) => amount + 4)}
        >
          See More
        </button>
      )}
    </div>
  );
};
