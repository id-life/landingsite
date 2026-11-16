'use client';

import { diseaseManagementStatusItems } from '@/constants/disease-management';
import { DiseaseManagementStatusItem } from '@/components/disease-management/DiseaseManagementStatusItem';

export default function DiseaseManagementPage() {
  return (
    <div // One column below 1200 px: at the 16 px root two tables side by side overflow a tablet (RWD-01).
      className="grid grid-cols-2 gap-15 mobile:grid-cols-1 mobile:gap-7 medium:grid-cols-1 expanded:grid-cols-1"
    >
      {diseaseManagementStatusItems.map((item) => (
        <DiseaseManagementStatusItem key={item.title} {...item} />
      ))}
    </div>
  );
}
