import React from 'react';
import ReactECharts from 'echarts-for-react';
import { SupplementData } from '@/components/charts/ChartData';

export default function SupplementChart() {
  const options = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    series: [
      {
        type: 'tree',
        data: [SupplementData],
        left: '2%',
        right: '2%',
        top: '20%',
        bottom: '8%',
        symbol: 'emptyCircle',
        orient: 'BT',
        expandAndCollapse: true,
        label: {
          position: 'bottom',
          verticalAlign: 'middle',
          align: 'center',
        },
        leaves: {
          label: {
            position: 'top',
            rotate: 90,
            verticalAlign: 'middle',
            align: 'left',
          },
        },
        emphasis: {
          focus: 'descendant',
        },
        animationDurationUpdate: 750,
      },
    ],
  };

  return <ReactECharts option={options} style={{ width: '100%', height: '100%' }} />;
}
