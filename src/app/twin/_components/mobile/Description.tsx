'use client';

import Tag from './Tag';
import { useState, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { currentModelAtom, descriptionDrawerAtom, PredictionModel } from '@/atoms/twin';
import ReportM01 from './ReportM01';
import ReportM02 from './ReportM02';
import ReportM03 from './ReportM03';

export default function Description() {
  const [currentModel] = useAtom(currentModelAtom);
  const [descriptionDrawer, setDescriptionDrawer] = useAtom(descriptionDrawerAtom);

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

  const openDrawer = () => {
    setDescriptionDrawer(true);
  };

  if (!tags.length) return null;

  return (
    <div className="absolute bottom-20 left-0 w-full px-5">
      <div className="flex items-center">
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-2 whitespace-nowrap">
            {tags.map((tag, index) => (
              <Tag key={tag} text={tag} isActive={index === 0} />
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
