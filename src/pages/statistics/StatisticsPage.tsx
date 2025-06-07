import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import StatisticsChart from '../../components/statistics/StatisticsChart';
import StatisticsWidget from '../../components/statistics/StatisticsWidget';
import { useAuth } from '../../contexts/AuthContext';
import { getStatisticsByUser } from '../../services/api';
import '../../styles/StatisticsPage.scss';

interface StatisticsData {
  id: string;
  propertyId: string;
  propertyName: string;
  period: string;
  energyUsage: number;
  cost: number;
  savings: number;
  comparisonPercentage: number;
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

const StatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isTestMode } = useAuth();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await getStatisticsByUser(selectedPeriod);
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated || isTestMode) {
      fetchStatistics();
    }
  }, [isAuthenticated, isTestMode, selectedPeriod]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="statistics-page">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Energy Usage Statistics</h1>
            <div className="period-selector">
              <button 
                className={`period-button ${selectedPeriod === 'week' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('week')}
              >
                Week
              </button>
              <button 
                className={`period-button ${selectedPeriod === 'month' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('month')}
              >
                Month
              </button>
              <button 
                className={`period-button ${selectedPeriod === 'year' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('year')}
              >
                Year
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading statistics...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : statistics.length === 0 ? (
            <div className="empty-state">
              <h2>No statistics available</h2>
              <p>Statistics will appear once your thermostats have been active for some time.</p>
            </div>
          ) : (
            <div className="statistics-content">
              <div className="statistics-widgets">
                {statistics.map(stat => (
                  <StatisticsWidget 
                    key={stat.id}
                    propertyName={stat.propertyName}
                    energyUsage={stat.energyUsage}
                    cost={stat.cost}
                    savings={stat.savings}
                    comparisonPercentage={stat.comparisonPercentage}
                  />
                ))}
              </div>
              
              <div className="statistics-charts">
                {statistics.map(stat => (
                  <StatisticsChart 
                    key={stat.id}
                    propertyName={stat.propertyName}
                    chartData={stat.chartData}
                    period={selectedPeriod}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
