import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './StatisticsChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticsChartProps {
  statistics: any[];
  chartType?: 'line' | 'bar';
  dataType?: 'energy' | 'cost' | 'savings' | 'temperature';
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ 
  statistics, 
  chartType = 'line',
  dataType = 'energy'
}) => {
  // Process data based on dataType
  const processData = () => {
    // Sort statistics by date
    const sortedStats = [...statistics].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Extract labels (dates)
    const labels = sortedStats.map(stat => 
      new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    
    // Extract data based on dataType
    let data;
    let label;
    let borderColor;
    let backgroundColor;
    
    switch (dataType) {
      case 'cost':
        data = sortedStats.map(stat => stat.cost);
        label = 'Cost ($)';
        borderColor = 'rgba(255, 99, 132, 1)';
        backgroundColor = 'rgba(255, 99, 132, 0.2)';
        break;
      case 'savings':
        data = sortedStats.map(stat => stat.savings || 0);
        label = 'Savings ($)';
        borderColor = 'rgba(75, 192, 192, 1)';
        backgroundColor = 'rgba(75, 192, 192, 0.2)';
        break;
      case 'temperature':
        data = sortedStats.map(stat => stat.average_temperature || 0);
        label = 'Avg. Temperature (°F)';
        borderColor = 'rgba(255, 159, 64, 1)';
        backgroundColor = 'rgba(255, 159, 64, 0.2)';
        break;
      case 'energy':
      default:
        data = sortedStats.map(stat => stat.energy_usage);
        label = 'Energy Usage (kWh)';
        borderColor = 'rgba(54, 162, 235, 1)';
        backgroundColor = 'rgba(54, 162, 235, 0.2)';
        break;
    }
    
    return { labels, data, label, borderColor, backgroundColor };
  };
  
  const { labels, data, label, borderColor, backgroundColor } = processData();
  
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor,
        backgroundColor,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  return (
    <div className="statistics-chart">
      <div className="chart-container">
        {chartType === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
      <div className="chart-controls">
        <div className="data-type-selector">
          <button className={dataType === 'energy' ? 'active' : ''}>Energy</button>
          <button className={dataType === 'cost' ? 'active' : ''}>Cost</button>
          <button className={dataType === 'savings' ? 'active' : ''}>Savings</button>
          <button className={dataType === 'temperature' ? 'active' : ''}>Temperature</button>
        </div>
        <div className="chart-type-selector">
          <button className={chartType === 'line' ? 'active' : ''}>
            <i className="fas fa-chart-line"></i>
          </button>
          <button className={chartType === 'bar' ? 'active' : ''}>
            <i className="fas fa-chart-bar"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;
