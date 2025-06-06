import React, { useState } from 'react';
import './AddThermostatModal.css';

interface AddThermostatModalProps {
  onAdd: (thermostatData: any) => void;
  onClose: () => void;
}

const AddThermostatModal: React.FC<AddThermostatModalProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: 'nest',
    model: '',
    device_id: '',
    target_temperature: 72,
    api_key: '',
    api_token: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Thermostat name is required';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    
    if (!formData.device_id.trim()) {
      newErrors.device_id = 'Device ID is required';
    }
    
    if (formData.target_temperature < 50 || formData.target_temperature > 90) {
      newErrors.target_temperature = 'Temperature must be between 50°F and 90°F';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Convert target_temperature to number
      const thermostatData = {
        ...formData,
        target_temperature: Number(formData.target_temperature)
      };
      
      onAdd(thermostatData);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Thermostat</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Thermostat Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Living Room Thermostat"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <select
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            >
              <option value="nest">Google Nest</option>
              <option value="cielo">Cielo</option>
              <option value="pioneer">Pioneer</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={errors.model ? 'error' : ''}
              placeholder="E.g., Nest Learning Thermostat"
            />
            {errors.model && <div className="error-message">{errors.model}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="device_id">Device ID</label>
            <input
              type="text"
              id="device_id"
              name="device_id"
              value={formData.device_id}
              onChange={handleChange}
              className={errors.device_id ? 'error' : ''}
              placeholder="Unique device identifier"
            />
            {errors.device_id && <div className="error-message">{errors.device_id}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="target_temperature">Initial Target Temperature (°F)</label>
            <input
              type="number"
              id="target_temperature"
              name="target_temperature"
              value={formData.target_temperature}
              onChange={handleChange}
              className={errors.target_temperature ? 'error' : ''}
              min="50"
              max="90"
              step="0.5"
            />
            {errors.target_temperature && <div className="error-message">{errors.target_temperature}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="api_key">API Key (Optional)</label>
            <input
              type="text"
              id="api_key"
              name="api_key"
              value={formData.api_key}
              onChange={handleChange}
              placeholder="For direct API integration"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="api_token">API Token (Optional)</label>
            <input
              type="text"
              id="api_token"
              name="api_token"
              value={formData.api_token}
              onChange={handleChange}
              placeholder="For direct API integration"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Thermostat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddThermostatModal;
