import React from 'react';
import './StatisticsWidget.css';

interface StatisticsWidgetProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

const StatisticsWidget: React.FC<StatisticsWidgetProps> = ({
  title,
  value,
  unit,
  icon = 'fas fa-chart-line',
  change,
  color = 'primary'
}) => {
  return (
    <div className={`statistics-widget ${color}`}>
      <div className="widget-icon">
        <i className={icon}></i>
      </div>
      <div className="widget-content">
        <h3 className="widget-title">{title}</h3>
        <div className="widget-value">
          {value}
          {unit && <span className="widget-unit">{unit}</span>}
        </div>
        {change && (
          <div className={`widget-change ${change.isPositive ? 'positive' : 'negative'}`}>
            <i className={`fas fa-arrow-${change.isPositive ? 'up' : 'down'}`}></i>
            <span>{Math.abs(change.value)}%</span>
            <span className="change-period">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsWidget;
