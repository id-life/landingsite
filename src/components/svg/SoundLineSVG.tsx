export default function SoundLineSVG({ className, isOff }: { className?: string; isOff?: boolean }) {
  return isOff ? (
    <svg className={className} width="35" height="2" viewBox="0 0 35 2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 1.277h35" stroke="url(#paint0_linear_5468_1152)" />
      <defs>
        <linearGradient
          id="paint0_linear_5468_1152"
          x1="35"
          y1="-24423400000000"
          x2="0"
          y2="-24423400000000"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--background)" stopOpacity="0" />
          <stop offset=".505" stopColor="var(--background)" />
          <stop offset="1" stopColor="var(--background)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg className={className} width="33" height="14" viewBox="0 0 33 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.89 2.048C15.198 1.35 15.85 1 16.5 1c.65 0 1.301.35 1.61 1.048l3.725 8.403c1.607 3.627 6.82 3.425 8.143-.315A3.382 3.382 0 0 1 33 7.883V6.882a4.382 4.382 0 0 0-3.965 2.921c-1.02 2.887-5.045 3.042-6.286.243l-3.724-8.403A2.725 2.725 0 0 0 16.5 0c-1.02 0-2.04.548-2.525 1.643l-3.724 8.403c-1.24 2.8-5.265 2.644-6.286-.243A4.382 4.382 0 0 0 0 6.882v1.001a3.382 3.382 0 0 1 3.022 2.253c1.323 3.74 6.536 3.942 8.143.315l3.724-8.403z"
        fill="url(#paint0_linear_7007_339)"
      />
      <defs>
        <linearGradient id="paint0_linear_7007_339" y1="5.679" x2="33" y2="5.679" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--background)" stopOpacity=".25" />
          <stop offset=".2" stopColor="var(--background)" stopOpacity=".4" />
          <stop offset=".505" stopColor="var(--background)" />
          <stop offset=".8" stopColor="var(--background)" stopOpacity=".4" />
          <stop offset="1" stopColor="var(--background)" stopOpacity=".25" />
        </linearGradient>
      </defs>
    </svg>
  );
}
