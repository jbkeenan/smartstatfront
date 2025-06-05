import React, { useState, useEffect } from 'react';
import { calendarsApi, type Calendar, type CalendarEvent } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

const CalendarsPage: React.FC = () => {
  const { isTestMode } = useAuth();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(null);
  const [newCalendar, setNewCalendar] = useState({
    name: '',
    description: '',
    color: '#4f46e5',
    is_active: true
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    calendar_id: ''
  });
  const [showAddEventForm, setShowAddEventForm] = useState(false);

  useEffect(() => {
    fetchCalendars();
  }, []);

  useEffect(() => {
    if (selectedCalendarId) {
      fetchEvents(selectedCalendarId);
    } else {
      setEvents([]);
    }
  }, [selectedCalendarId]);

  const fetchCalendars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await calendarsApi.getAll();
      setCalendars(data);
      if (data.length > 0 && !selectedCalendarId) {
        setSelectedCalendarId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching calendars:', err);
      setError('Failed to load calendars. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async (calendarId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await calendarsApi.getEvents(calendarId);
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load calendar events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalendarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCalendar(prev => ({ ...prev, [name]: value }));
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const addedCalendar = await calendarsApi.create(newCalendar);
      setCalendars(prev => [...prev, addedCalendar]);
      setNewCalendar({
        name: '',
        description: '',
        color: '#4f46e5',
        is_active: true
      });
      setShowAddForm(false);
      if (!selectedCalendarId) {
        setSelectedCalendarId(addedCalendar.id);
      }
    } catch (err) {
      console.error('Error adding calendar:', err);
      setError('Failed to add calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCalendarId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const eventData = {
        ...newEvent,
        calendar_id: selectedCalendarId
      };
      
      const addedEvent = await calendarsApi.createEvent(eventData);
      setEvents(prev => [...prev, addedEvent]);
      setNewEvent({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        calendar_id: ''
      });
      setShowAddEventForm(false);
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCalendar = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this calendar? All associated events will also be deleted.')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await calendarsApi.delete(id);
      setCalendars(prev => prev.filter(calendar => calendar.id !== id));
      if (selectedCalendarId === id) {
        const remainingCalendars = calendars.filter(calendar => calendar.id !== id);
        setSelectedCalendarId(remainingCalendars.length > 0 ? remainingCalendars[0].id : null);
      }
    } catch (err) {
      console.error('Error deleting calendar:', err);
      setError('Failed to delete calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await calendarsApi.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && calendars.length === 0) {
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
          <p>You are viewing simulated data. No actual calendar data is being modified.</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Calendars</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {showAddForm ? 'Cancel' : 'Add Calendar'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Calendar</h3>
          <form onSubmit={handleAddCalendar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Calendar Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newCalendar.name}
                  onChange={handleCalendarInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Work Schedule, Vacation Days"
                />
              </div>
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={newCalendar.color}
                    onChange={handleCalendarInputChange}
                    className="h-10 w-10 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="text"
                    value={newCalendar.color}
                    onChange={handleCalendarInputChange}
                    name="color"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newCalendar.description}
                  onChange={handleCalendarInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Calendar description..."
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? 'Adding...' : 'Add Calendar'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {calendars.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No calendars found. Add your first calendar to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">My Calendars</h3>
              <ul className="space-y-2">
                {calendars.map(calendar => (
                  <li key={calendar.id} className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCalendarId(calendar.id)}
                      className={`flex items-center py-2 px-3 rounded-md w-full text-left ${
                        selectedCalendarId === calendar.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: calendar.color }}
                      ></span>
                      <span className={`${selectedCalendarId === calendar.id ? 'font-medium' : ''}`}>
                        {calendar.name}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteCalendar(calendar.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {selectedCalendarId ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {calendars.find(c => c.id === selectedCalendarId)?.name} Events
                    </h3>
                    <button
                      onClick={() => setShowAddEventForm(!showAddEventForm)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {showAddEventForm ? 'Cancel' : 'Add Event'}
                    </button>
                  </div>
                  
                  {showAddEventForm && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="text-md font-semibold text-gray-700 mb-3">Add New Event</h4>
                      <form onSubmit={handleAddEvent}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                              Event Title
                            </label>
                            <input
                              type="text"
                              id="title"
                              name="title"
                              value={newEvent.title}
                              onChange={handleEventInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              id="event-description"
                              name="description"
                              value={newEvent.description}
                              onChange={handleEventInputChange}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                          </div>
                          <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              id="start_date"
                              name="start_date"
                              value={newEvent.start_date}
                              onChange={handleEventInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                              End Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              id="end_date"
                              name="end_date"
                              value={newEvent.end_date}
                              onChange={handleEventInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            {isLoading ? 'Adding...' : 'Add Event'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  {events.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No events found for this calendar.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.map(event => (
                        <div key={event.id} className="border-l-4 pl-4 py-3" style={{ borderColor: calendars.find(c => c.id === selectedCalendarId)?.color || '#4f46e5' }}>
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-800">{event.title}</h4>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          {event.description && (
                            <p className="text-gray-600 mt-1">{event.description}</p>
                          )}
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Select a calendar to view events.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarsPage;
