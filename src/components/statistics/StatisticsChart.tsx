import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticsChartProps {
  propertyName: string;
  period: string;
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ propertyName, period, chartData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${propertyName} - ${period.charAt(0).toUpperCase() + period.slice(1)}ly Energy Usage`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Energy Usage (kWh)',
        },
      },
      x: {
        title: {
          display: true,
          text: period === 'week' ? 'Day' : period === 'month' ? 'Week' : 'Month',
        },
      },
    },
  };

  return (
    <div className="statistics-chart">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default StatisticsChart;
