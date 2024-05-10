import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import useSections from '@/src/hooks/useSections';

const AreaCharts = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );

  const { archives, tasks_count } = useSections();
  const [data, setData] = useState<{labels: string[], datasets: any[]}>({ labels: [], datasets: [] });

  useEffect(() => {
    const labels = [];
    const totalData = new Array(6).fill(tasks_count);
    const archiveData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = `${date.getMonth() + 1}`.padStart(2, '0') + ` / ${date.getDate()}`.padStart(2, '0');
      labels.push(formattedDate);

      const archiveCount = Array.from(archives.values()).filter(task => {
        if (task.archive) {
          const taskDate = new Date(task.archive);
          return taskDate.toDateString() === date.toDateString();
        }
      }).length;
      archiveData.push(archiveCount);
    }

    setData({
      labels,
      datasets: [
        {
          fill: 'stack',
          label: '完了',
          data: archiveData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 1)',
        },
        {
          fill: 'stack',
          label: '合計',
          data: totalData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ]
    });
  }, [archives, tasks_count]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'タスクの概観',
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '96%', height: '96%' }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default AreaCharts;
