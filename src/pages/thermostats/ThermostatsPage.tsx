import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { Thermostat } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import ErrorHandler from '../../components/shared/ErrorHandler';

// Define the allowed thermostat modes
type ThermostatMode = 'heat' | 'cool' | 'auto' | 'off';

const ThermostatsPage: React.FC = () => {
  const { isTestMode } = useAuth();
  const [thermostats, setThermostats] = useState<Thermostat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [newThermostat, setNewThermostat] = useState({
    name: '',
    property_id: '',
    location: 'Living Room',
    model: 'Smart Thermostat Pro',
    current_temperature: 72,
    target_temperature: 72,
    mode: 'auto' as ThermostatMode,
    is_online: true
  });
  
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's a property filter in the URL
    const params = new URLSearchParams(location.search);
    const propertyId = params.get('property');
    if (propertyId) {
      setSelectedPropertyId(propertyId);
      fetchThermostats(propertyId);
    } else {
      fetchThermostats();
    }
  }, [location.search]);

  const fetchThermostats = async (propertyId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = propertyId 
        ? await api.thermostats.getByProperty(propertyId)
        : await api.thermostats.getAll();
      setThermostats(data);
    } catch (err) {
      console.error('Error fetching thermostats:', err);
      setError(err instanceof Error ? err : new Error('Failed to load thermostats'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewThermostat(prev => ({
      ...prev,
      [name]: name === 'current_temperature' || name === 'target_temperature'
        ? Number(value)
        : name === 'is_online'
        ? value === 'true'
        : name === 'mode'
        ? value as ThermostatMode
        : value
    }));
  };

  const handleAddThermostat = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // If we have a selected property, use that
      const thermostatData = {
        ...newThermostat,
        property_id: selectedPropertyId || newThermostat.property_id,
      };
      
      const addedThermostat = await api.thermostats.create(thermostatData);
      setThermostats(prev => [...prev, addedThermostat]);
      setNewThermostat({
        name: '',
        property_id: '',
        location: 'Living Room',
        model: 'Smart Thermostat Pro',
        current_temperature: 72,
        target_temperature: 72,
        mode: 'auto' as ThermostatMode,
        is_online: true
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding thermostat:', err);
      setError(err instanceof Error ? err : new Error('Failed to add thermostat'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteThermostat = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this thermostat?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await api.thermostats.delete(id);
      setThermostats(prev => prev.filter(thermostat => thermostat.id !== id));
    } catch (err) {
      console.error('Error deleting thermostat:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete thermostat'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemperatureChange = async (id: string, temperature: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedThermostat = await api.thermostats.setTemperature(id, temperature);
      setThermostats(prev => 
        prev.map(thermostat => 
          thermostat.id === id ? updatedThermostat : thermostat
        )
      );
    } catch (err) {
      console.error('Error updating temperature:', err);
      setError(err instanceof Error ? err : new Error('Failed to update temperature'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = async (id: string, mode: ThermostatMode) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedThermostat = await api.thermostats.setMode(id, mode);
      setThermostats(prev => 
        prev.map(thermostat => 
          thermostat.id === id ? updatedThermostat : thermostat
        )
      );
    } catch (err) {
      console.error('Error updating mode:', err);
      setError(err instanceof Error ? err : new Error('Failed to update mode'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && thermostats.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {isTestMode && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">Test Mode Active</p>
          <p>You are viewing simulated data. No actual thermostat data is being modified.</p>
        </div>
      )}
      
      <ErrorHandler error={error} onRetry={() => fetchThermostats(selectedPropertyId || undefined)} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedPropertyId ? 'Property Thermostats' : 'All Thermostats'}
        </h2>
        <div className="flex space-x-2">
          {selectedPropertyId && (
            <button
              onClick={() => {
                setSelectedPropertyId(null);
                fetchThermostats();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              View All Thermostats
            </button>
          )}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showAddForm ? 'Cancel' : 'Add Thermostat'}
          </button>
        </div>
      </div>
      
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Thermostat</h3>
          <form onSubmit={handleAddThermostat}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Thermostat Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newThermostat.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Living Room Thermostat"
                />
              </div>
              
              {!selectedPropertyId && (
                <div>
                  <label htmlFor="property_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Property ID
                  </label>
                  <input
                    type="text"
                    id="property_id"
                    name="property_id"
                    value={newThermostat.property_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newThermostat.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Living Room, Bedroom, Office"
                />
              </div>
              
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={newThermostat.model}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="target_temperature" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Temperature (°F)
                </label>
                <input
                  type="number"
                  id="target_temperature"
                  name="target_temperature"
                  value={newThermostat.target_temperature}
                  onChange={handleInputChange}
                  required
                  min="50"
                  max="90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                  Mode
                </label>
                <select
                  id="mode"
                  name="mode"
                  value={newThermostat.mode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="heat">Heat</option>
                  <option value="cool">Cool</option>
                  <option value="auto">Auto</option>
                  <option value="off">Off</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? 'Adding...' : 'Add Thermostat'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {thermostats.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No thermostats found. Add your first thermostat to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {thermostats.map(thermostat => (
            <div key={thermostat.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{thermostat.name}</h3>
                    <p className="text-gray-600 text-sm">{thermostat.location}</p>
                    <p className="text-gray-500 text-xs">Model: {thermostat.model}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${thermostat.is_online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {thermostat.is_online ? 'Online' : 'Offline'}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Current</p>
                    <p className="text-2xl font-semibold text-gray-700">{thermostat.current_temperature}°F</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Target</p>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleTemperatureChange(thermostat.id, thermostat.target_temperature - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <p className="text-2xl font-semibold text-gray-700 mx-2">{thermostat.target_temperature}°F</p>
                      <button
                        onClick={() => handleTemperatureChange(thermostat.id, thermostat.target_temperature + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-500 text-sm mb-2">Mode</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleModeChange(thermostat.id, 'heat')}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        thermostat.mode === 'heat'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Heat
                    </button>
                    <button
                      onClick={() => handleModeChange(thermostat.id, 'cool')}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        thermostat.mode === 'cool'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cool
                    </button>
                    <button
                      onClick={() => handleModeChange(thermostat.id, 'auto')}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        thermostat.mode === 'auto'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      onClick={() => handleModeChange(thermostat.id, 'off')}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        thermostat.mode === 'off'
                          ? 'bg-gray-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Off
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteThermostat(thermostat.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThermostatsPage;
