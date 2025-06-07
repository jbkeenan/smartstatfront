import React from 'react';
import './StatisticsWidget.scss';

interface StatisticsWidgetProps {
  propertyName: string;
  energyUsage: number;
  cost: number;
  savings: number;
  comparisonPercentage: number;
}

const StatisticsWidget: React.FC<StatisticsWidgetProps> = ({
  propertyName,
  energyUsage,
  cost,
  savings,
  comparisonPercentage
}) => {
  return (
    <div className="statistics-widget">
      <div className="widget-header">
        <h3>{propertyName}</h3>
      </div>
      <div className="widget-content">
        <div className="stat-item">
          <div className="stat-label">Energy Usage</div>
          <div className="stat-value">{energyUsage} kWh</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Cost</div>
          <div className="stat-value">${cost.toFixed(2)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Savings</div>
          <div className="stat-value">${savings.toFixed(2)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Comparison</div>
          <div className={`stat-value ${comparisonPercentage < 0 ? 'positive' : 'negative'}`}>
            {comparisonPercentage < 0 ? '↓' : '↑'} {Math.abs(comparisonPercentage)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsWidget;
