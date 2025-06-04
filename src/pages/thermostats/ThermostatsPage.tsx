import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/shared/Layout';
import { thermostatsApi, Thermostat } from '../../lib/api';

const ThermostatsPage: React.FC = () => {
  const [thermostats, setThermostats] = useState<Thermostat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThermostats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await thermostatsApi.getAll();
        setThermostats(data);
      } catch (err: any) {
        console.error('Error fetching thermostats:', err);
        setError(err.message || 'Failed to load thermostats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThermostats();
  }, []);

  const handleDeleteThermostat = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this thermostat? This will also delete all associated schedules.')) {
      try {
        await thermostatsApi.delete(id);
        setThermostats(thermostats.filter(thermostat => thermostat.id !== id));
      } catch (err: any) {
        console.error('Error deleting thermostat:', err);
        setError(err.message || 'Failed to delete thermostat');
      }
    }
  };

  return (
    <Layout>
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Thermostats</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your connected thermostats
          </p>
        </div>
        <Link
          to="/thermostats/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Thermostat
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 my-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      ) : thermostats.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No thermostats</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by connecting a new thermostat.</p>
          <div className="mt-6">
            <Link
              to="/thermostats/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Thermostat
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {thermostats.map((thermostat) => (
            <div
              key={thermostat.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {thermostat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {thermostat.current_temperature ? `${thermostat.current_temperature}°F` : 'N/A'}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold">
                          {thermostat.target_temperature && (
                            <span className="text-green-600">
                              Target: {thermostat.target_temperature}°F
                            </span>
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      {thermostat.model}
                    </div>
                    <div>
                      {thermostat.is_heating ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Heating
                        </span>
                      ) : thermostat.is_cooling ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Cooling
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Idle
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Last updated: {thermostat.last_updated ? new Date(thermostat.last_updated).toLocaleString() : 'Never'}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
                <div className="text-sm">
                  <Link to={`/thermostats/${thermostat.id}`} className="font-medium text-blue-600 hover:text-blue-500">
                    View details
                  </Link>
                </div>
                <div className="text-sm">
                  <Link to={`/thermostats/${thermostat.id}/edit`} className="font-medium text-indigo-600 hover:text-indigo-500 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteThermostat(thermostat.id)}
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ThermostatsPage;
