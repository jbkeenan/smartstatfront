import React, { useState } from 'react';
import './ThermostatCard.css';

interface ThermostatProps {
  thermostat: {
    id: string;
    name: string;
    brand: string;
    model: string;
    current_temperature: number;
    target_temperature: number;
    humidity: number;
    mode: string;
    is_online: boolean;
    last_updated: string;
  };
}

const ThermostatCard: React.FC<ThermostatProps> = ({ thermostat }) => {
  const [targetTemp, setTargetTemp] = useState(thermostat.target_temperature);
  const [currentMode, setCurrentMode] = useState(thermostat.mode);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleTempChange = (increment: boolean) => {
    setTargetTemp(prev => increment ? prev + 1 : prev - 1);
    setIsUpdating(true);
    
    // Simulate API call to update thermostat
    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };
  
  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    setIsUpdating(true);
    
    // Simulate API call to update thermostat
    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };
  
  const getBrandIcon = () => {
    switch(thermostat.brand.toLowerCase()) {
      case 'nest':
        return 'fab fa-google';
      case 'cielo':
        return 'fas fa-snowflake';
      case 'pioneer':
        return 'fas fa-fan';
      default:
        return 'fas fa-thermometer-half';
    }
  };
  
  const formatLastUpdated = () => {
    const date = new Date(thermostat.last_updated);
    return date.toLocaleString();
  };
  
  return (
    <div className={`thermostat-card ${!thermostat.is_online ? 'offline' : ''}`}>
      <div className="thermostat-header">
        <div className="thermostat-name">
          <h3>{thermostat.name}</h3>
          <span className={`status-indicator ${thermostat.is_online ? 'online' : 'offline'}`}>
            {thermostat.is_online ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="thermostat-brand">
          <i className={getBrandIcon()}></i>
          <span>{thermostat.model}</span>
        </div>
      </div>
      
      <div className="thermostat-body">
        <div className="temperature-display">
          <div className="current-temp">
            <span className="temp-value">{thermostat.current_temperature}</span>
            <span className="temp-unit">°F</span>
          </div>
          <div className="humidity">
            <i className="fas fa-tint"></i>
            <span>{thermostat.humidity}%</span>
          </div>
        </div>
        
        <div className="temperature-controls">
          <button 
            className="temp-button" 
            onClick={() => handleTempChange(false)}
            disabled={isUpdating || !thermostat.is_online}
          >
            <i className="fas fa-minus"></i>
          </button>
          <div className="target-temp">
            <span className="target-temp-value">{targetTemp}</span>
            <span className="temp-unit">°F</span>
            <div className="target-label">Target</div>
          </div>
          <button 
            className="temp-button" 
            onClick={() => handleTempChange(true)}
            disabled={isUpdating || !thermostat.is_online}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      
      <div className="thermostat-footer">
        <div className="mode-controls">
          <button 
            className={`mode-button ${currentMode === 'cool' ? 'active' : ''}`}
            onClick={() => handleModeChange('cool')}
            disabled={isUpdating || !thermostat.is_online}
          >
            <i className="fas fa-snowflake"></i>
            <span>Cool</span>
          </button>
          <button 
            className={`mode-button ${currentMode === 'heat' ? 'active' : ''}`}
            onClick={() => handleModeChange('heat')}
            disabled={isUpdating || !thermostat.is_online}
          >
            <i className="fas fa-fire"></i>
            <span>Heat</span>
          </button>
          <button 
            className={`mode-button ${currentMode === 'auto' ? 'active' : ''}`}
            onClick={() => handleModeChange('auto')}
            disabled={isUpdating || !thermostat.is_online}
          >
            <i className="fas fa-sync-alt"></i>
            <span>Auto</span>
          </button>
          <button 
            className={`mode-button ${currentMode === 'off' ? 'active' : ''}`}
            onClick={() => handleModeChange('off')}
            disabled={isUpdating || !thermostat.is_online}
          >
            <i className="fas fa-power-off"></i>
            <span>Off</span>
          </button>
        </div>
        
        <div className="last-updated">
          Last updated: {formatLastUpdated()}
        </div>
      </div>
      
      {isUpdating && (
        <div className="updating-overlay">
          <div className="spinner"></div>
          <span>Updating...</span>
        </div>
      )}
    </div>
  );
};

export default ThermostatCard;
