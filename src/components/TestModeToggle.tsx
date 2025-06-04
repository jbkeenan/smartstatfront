import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './TestModeToggle.css';

const TestModeToggle: React.FC = () => {
  const { isTestMode, toggleTestMode } = useAuth();

  return (
    <div className="test-mode-toggle">
      <div className="toggle-container">
        <span className={`toggle-label ${!isTestMode ? 'active' : ''}`}>Normal Mode</span>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={isTestMode} 
            onChange={toggleTestMode}
            aria-label="Toggle test mode"
          />
          <span className="slider round"></span>
        </label>
        <span className={`toggle-label ${isTestMode ? 'active' : ''}`}>Test Mode</span>
      </div>
      {isTestMode && (
        <div className="test-mode-badge">
          <span>Test Mode Active</span>
          <div className="test-mode-info">
            <p>You are currently in Test Mode. No authentication required.</p>
            <p>All features are available for testing without creating an account.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestModeToggle;
