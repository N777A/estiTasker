import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import useSections from '@/src/hooks/useSections';

const PieChart = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const {archives_count, unArchives_count} = useSections();
  const data = {
    labels: ['完了', '未完了'],
    datasets: [
      {
        label: '',
        data: [archives_count, unArchives_count],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ position: 'relative',  width: '96%', height: '96%' }} >
      <Pie data={data} />
    </div>
  )
}
export default PieChart;
