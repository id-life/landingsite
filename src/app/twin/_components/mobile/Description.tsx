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
        setTags(['30 YEARS', 'Sedentary', 'High-Sugar']);
        break;
      case PredictionModel.M2:
        setTags(['5 YEARS', 'Disciplined Wellness', 'Balanced Nutrition']);
        break;
      case PredictionModel.M3:
        setTags(['3 MONTHS', 'Structured fitness', 'Precision-Controlled']);
        break;
      default:
        setTags([]);
    }
  }, [currentModel]);

  return (
    <div className="twin-tag absolute bottom-20 left-0 w-full px-5 z-10">
      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-2 whitespace-nowrap">
            {tags.map((tag, index) => (
              <Tag key={tag} text={tag} />
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
