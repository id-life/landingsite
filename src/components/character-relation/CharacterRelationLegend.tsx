import { cn } from '@/utils';
import { ReactNode } from 'react';

const CharacterRelationLegend = () => {
  const legends: {
    example: ReactNode;
    label: string;
  }[] = [
    {
      example: <div className="h-1.5 w-1.5 rounded-full bg-[#00329a]" />,
      label: 'User',
    },
    {
      example: <div className="h-1.5 w-1.5 rounded-full bg-red-600" />,
      label: 'Person who inspired them',
    },
    {
      example: <div className="h-0.5 w-full -translate-y-1/2 rounded-full bg-[#00329a]" />,
      label: 'First impression is mixed',
    },
    {
      example: <div className="h-0.5 w-full -translate-y-1/2 rounded-full bg-red-600" />,
      label: 'First impression is good',
    },
  ];

  return (
    <div
      className={cn(
        'legend-button fixed bottom-32 left-[3.125rem] z-[102] bg-white p-4 shadow-[0rem_0.175rem_0.3494rem_0rem_#00000040]',
        'mobile:bottom-[6.125rem] mobile:left-5 mobile:p-3',
      )}
    >
      <section className="flex flex-col gap-y-1.5">
        {legends.map((legend) => (
          <div key={legend.label} className="flex items-center gap-x-1">
            <div className="flex h-4 w-4 items-center mobile:h-3.5">{legend.example}</div>
            <div className="font-poppins text-sm/4 font-medium tracking-normal mobile:text-xs/3.5">{legend.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default CharacterRelationLegend;
