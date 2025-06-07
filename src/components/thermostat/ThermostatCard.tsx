import React from 'react';
import { Link } from 'react-router-dom';
import './ThermostatCard.scss';

interface ThermostatProps {
  thermostat: {
    id: string;
    name: string;
    brand: string;
    model: string;
    propertyId: string;
    propertyName: string;
    currentTemperature: number;
    targetTemperature: number;
    mode: string;
    isOnline: boolean;
  };
}

const ThermostatCard: React.FC<ThermostatProps> = ({ thermostat }) => {
  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'heat':
        return '🔥';
      case 'cool':
        return '❄️';
      case 'auto':
        return '🔄';
      case 'off':
        return '⭕';
      default:
        return '⚙️';
    }
  };

  return (
    <div className={`thermostat-card ${!thermostat.isOnline ? 'offline' : ''}`}>
      <div className="card-header">
        <h3>{thermostat.name}</h3>
        <span className={`status-indicator ${thermostat.isOnline ? 'online' : 'offline'}`}>
          {thermostat.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      
      <div className="card-content">
        <div className="property-info">
          <span className="label">Property:</span>
          <Link to={`/properties/${thermostat.propertyId}`} className="property-link">
            {thermostat.propertyName}
          </Link>
        </div>
        
        <div className="temperature-display">
          <div className="current-temp">
            <span className="temp-value">{thermostat.currentTemperature}°</span>
            <span className="temp-label">Current</span>
          </div>
          <div className="target-temp">
            <span className="temp-value">{thermostat.targetTemperature}°</span>
            <span className="temp-label">Target</span>
          </div>
        </div>
        
        <div className="thermostat-info">
          <div className="info-item">
            <span className="label">Mode:</span>
            <span className="value">
              {getModeIcon(thermostat.mode)} {thermostat.mode.charAt(0).toUpperCase() + thermostat.mode.slice(1)}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Brand:</span>
            <span className="value">{thermostat.brand}</span>
          </div>
          <div className="info-item">
            <span className="label">Model:</span>
            <span className="value">{thermostat.model}</span>
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        <Link to={`/thermostats/${thermostat.id}`} className="btn btn-primary">
          Control
        </Link>
        <Link to={`/thermostats/${thermostat.id}/schedule`} className="btn btn-secondary">
          Schedule
        </Link>
      </div>
    </div>
  );
};

export default ThermostatCard;
