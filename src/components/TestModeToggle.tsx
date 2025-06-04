import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './TestModeToggle.css';

const TestModeToggle: React.FC = () => {
  const { isTestMode, toggleTestMode } = useAuth();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Test mode toggle clicked');
    toggleTestMode();
  };

  return (
    <div className="test-mode-toggle">
      <button 
        onClick={handleToggle}
        className={`toggle-button ${isTestMode ? 'active' : ''}`}
      >
        <span className="toggle-label">Test Mode</span>
        <span className={`toggle-switch ${isTestMode ? 'active' : ''}`}>
          <span className="toggle-slider"></span>
        </span>
      </button>
    </div>
  );
};

export default TestModeToggle;
