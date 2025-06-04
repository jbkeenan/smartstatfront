import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/shared/Layout';
import { calendarsApi, propertiesApi, Calendar, Property } from '../../lib/api';

const CalendarsPage: React.FC = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [properties, setProperties] = useState<Record<string, Property>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [syncInProgress, setSyncInProgress] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [calendarsData, propertiesData] = await Promise.all([
          calendarsApi.getAll(),
          propertiesApi.getAll()
        ]);
        
        setCalendars(calendarsData);
        
        // Create a map of property IDs to property objects for easy lookup
        const propertyMap: Record<string, Property> = {};
        propertiesData.forEach((property: Property) => {
          propertyMap[property.id] = property;
        });
        setProperties(propertyMap);
      } catch (err: any) {
        console.error('Error fetching calendars data:', err);
        setError(err.message || 'Failed to load calendars');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteCalendar = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this calendar integration?')) {
      try {
        await calendarsApi.delete(id);
        setCalendars(calendars.filter(calendar => calendar.id !== id));
      } catch (err: any) {
        console.error('Error deleting calendar:', err);
        setError(err.message || 'Failed to delete calendar');
      }
    }
  };

  const handleSyncCalendars = async () => {
    setSyncInProgress(true);
    try {
      await calendarsApi.sync();
      // Refresh calendars after sync
      const calendarsData = await calendarsApi.getAll();
      setCalendars(calendarsData);
      alert('Calendars synchronized successfully!');
    } catch (err: any) {
      console.error('Error syncing calendars:', err);
      setError(err.message || 'Failed to sync calendars');
    } finally {
      setSyncInProgress(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Calendar Integrations</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Connect your booking calendars to automate thermostat schedules
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleSyncCalendars}
            disabled={syncInProgress || calendars.length === 0}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              syncInProgress || calendars.length === 0
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {syncInProgress ? 'Syncing...' : 'Sync Now'}
          </button>
          <Link
            to="/calendars/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Calendar
          </Link>
        </div>
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
      ) : calendars.length === 0 ? (
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No calendar integrations</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by connecting a booking calendar.</p>
          <div className="mt-6">
            <Link
              to="/calendars/new"
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
              Add Calendar
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Property
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        URL
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Synced
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {calendars.map((calendar) => (
                      <tr key={calendar.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              to={`/calendars/${calendar.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {calendar.name}
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {properties[calendar.property_id]?.name || 'Unknown Property'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            <a 
                              href={calendar.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {calendar.url}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {calendar.last_synced 
                              ? new Date(calendar.last_synced).toLocaleString() 
                              : 'Never'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            calendar.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {calendar.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/calendars/${calendar.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteCalendar(calendar.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Integration Guide */}
      <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Calendar Integration Guide
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            How to connect your booking calendars for automated temperature control
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="prose max-w-none">
            <p>
              Our system supports integration with popular booking platforms through iCal feeds:
            </p>
            <ul>
              <li><strong>Airbnb:</strong> Find your iCal export URL in your listing's calendar settings</li>
              <li><strong>VRBO/HomeAway:</strong> Access your iCal feed from the calendar section of your property dashboard</li>
              <li><strong>Booking.com:</strong> Export your calendar from the extranet under the calendar sync section</li>
              <li><strong>Google Calendar:</strong> Share your calendar publicly and copy the iCal address</li>
            </ul>
            <p>
              Once connected, our system will automatically adjust thermostat settings based on guest check-ins and check-outs.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarsPage;
