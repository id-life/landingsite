import Image from 'next/image';
import { TalkItem } from '@/app/insights/_components/TalksSection';

export default function TalkCard({ item }: { item: TalkItem }) {
  return (
    <div className="group flex gap-5">
      <div className="relative h-42 w-75 flex-shrink-0 overflow-hidden rounded-sm bg-gray-800">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue/20 to-purple/20" />
      </div>
      <div className="flex w-80 flex-1 flex-col justify-between py-1">
        <h3 className="font-poppins text-xl/6 font-semibold">{item.title}</h3>
        <span className="text-right text-gray-450">{item.date}</span>
      </div>
    </div>
  );
}
