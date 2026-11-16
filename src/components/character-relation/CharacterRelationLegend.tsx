import { cn } from '@/utils';
import { ReactNode } from 'react';

// Type roles (RWD-01): the labels are body-sm (caption on a phone). While the Be part of it form is open the legend
// fades out: the form covers the bottom of the screen and cut the legend's labels in half at 1440 px.
const CharacterRelationLegend = ({ hidden = false }: { hidden?: boolean }) => {
  const legends: {
    example: ReactNode;
    label: string;
  }[] = [
    {
      example: <div className="h-1.5 w-1.5 rounded-full bg-data-navy" />,
      label: 'User',
    },
    {
      example: <div className="h-1.5 w-1.5 rounded-full bg-accent" />,
      label: 'Person who inspired them',
    },
    {
      example: <div className="h-0.5 w-full -translate-y-1/2 rounded-full bg-data-navy" />,
      label: 'First impression is mixed',
    },
    {
      example: <div className="h-0.5 w-full -translate-y-1/2 rounded-full bg-accent" />,
      label: 'First impression is good',
    },
  ];

  return (
    <div
      className={cn(
        'legend-button fixed bottom-10 left-9 z-[10] bg-white p-4 shadow-[0rem_0.175rem_0.3494rem_0rem_#00000040]',
        'mobile:bottom-6 mobile:left-5 mobile:p-3',
        'transition-opacity duration-base',
        hidden && 'pointer-events-none opacity-0',
      )}
      aria-hidden={hidden || undefined}
    >
      <section className="flex flex-col gap-y-1.5">
        {legends.map((legend) => (
          <div key={legend.label} className="flex items-center gap-x-1">
            <div className="flex h-4 w-4 items-center mobile:h-3.5">{legend.example}</div>
            <div className="font-text text-body-sm font-medium leading-tight tracking-normal mobile:text-caption mobile:leading-tight">
              {legend.label}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default CharacterRelationLegend;
