'use client';

import { diseaseManagementStatusItems } from '@/constants/disease-management';
import { DiseaseManagementStatusItem } from '@/components/disease-management/DiseaseManagementStatusItem';
import { MobileDiseaseManagementStatusItem } from '@/components/disease-management/MobileDiseaseManagementStatusItem';

export default function DiseaseManagementPage() {
  return (
    <div className="grid grid-cols-2 gap-15 mobile:grid-cols-1 mobile:gap-7">
      {diseaseManagementStatusItems.map((item) => (
        <DiseaseManagementStatusItem key={item.title} {...item} />
      ))}
      {diseaseManagementStatusItems.map((item) => (
        <MobileDiseaseManagementStatusItem key={item.title} {...item} />
      ))}
    </div>
  );
}
