'use client';

import Tag from './Tag';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { currentModelAtom, PredictionModel } from '@/atoms/twin';
import ReportM01 from './ReportM01';
import ReportM02 from './ReportM02';
import ReportM03 from './ReportM03';

export default function Description() {
  const [currentModel] = useAtom(currentModelAtom);

  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    switch (currentModel) {
      case PredictionModel.M1:
        setTags(['30 Years', 'Sedentary', 'High-Sugar']);
        break;
      case PredictionModel.M2:
        setTags(['5 Years', 'Disciplined Wellness', 'Balanced Nutrition']);
        break;
      case PredictionModel.M3:
        setTags(['3 Months', 'Structured fitness', 'Precision-Controlled']);
        break;
      default:
        setTags([]);
    }
  }, [currentModel]);

  return (
    <div className="twin-tag absolute bottom-44 right-5 z-10 w-full px-5">
      <div className="flex flex-col items-end gap-2">
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            {tags.map((tag, index) => (
              <div key={tag} className="flex justify-center text-right text-xs/4 font-semibold items-center gap-1">
                <div className="h-1 w-1 bg-black"></div>
                {tag}
              </div>
            ))}
          </div>
        </div>
        {currentModel === PredictionModel.M1 && <ReportM01 />}
        {currentModel === PredictionModel.M2 && <ReportM02 />}
        {currentModel === PredictionModel.M3 && <ReportM03 />}
      </div>
    </div>
  );
}
