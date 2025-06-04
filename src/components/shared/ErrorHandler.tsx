import React from 'react';
import { AxiosError } from 'axios';

export interface ErrorHandlerProps {
  error?: Error | AxiosError | null;
  onRetry?: () => void;
  children?: React.ReactNode;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error, onRetry, children }) => {
  if (!error) return <>{children}</>;

  // Check if it's an Axios error with response data
  const isAxiosError = (error as AxiosError).isAxiosError;
  const statusCode = isAxiosError ? (error as AxiosError).response?.status : null;
  const errorMessage = isAxiosError 
    ? ((error as AxiosError).response?.data as any)?.error || error.message
    : error.message;

  // Determine error type based on status code or message
  let errorType = 'General Error';
  let errorDescription = 'An unexpected error occurred. Please try again.';
  let errorClass = 'border-red-500 bg-red-100 text-red-700';

  if (statusCode === 401 || statusCode === 403 || errorMessage.includes('unauthorized') || errorMessage.includes('forbidden')) {
    errorType = 'Authentication Error';
    errorDescription = 'You are not authorized to perform this action. Please log in again.';
    errorClass = 'border-orange-500 bg-orange-100 text-orange-700';
  } else if (statusCode === 404 || errorMessage.includes('not found')) {
    errorType = 'Not Found';
    errorDescription = 'The requested resource could not be found.';
    errorClass = 'border-yellow-500 bg-yellow-100 text-yellow-700';
  } else if (statusCode === 400 || errorMessage.includes('validation')) {
    errorType = 'Validation Error';
    errorDescription = 'Please check your input and try again.';
    errorClass = 'border-blue-500 bg-blue-100 text-blue-700';
  } else if (statusCode === 500 || errorMessage.includes('server')) {
    errorType = 'Server Error';
    errorDescription = 'There was a problem with the server. Please try again later.';
    errorClass = 'border-purple-500 bg-purple-100 text-purple-700';
  } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    errorType = 'Network Error';
    errorDescription = 'Please check your internet connection and try again.';
    errorClass = 'border-indigo-500 bg-indigo-100 text-indigo-700';
  }

  // Safely get response data as string for display
  const getResponseDataString = () => {
    if (isAxiosError && (error as AxiosError).response?.data) {
      try {
        return JSON.stringify((error as AxiosError).response?.data);
      } catch (e) {
        return 'Error data could not be displayed';
      }
    }
    return null;
  };

  const responseDataString = getResponseDataString();

  return (
    <div className={`mb-4 p-4 border-l-4 ${errorClass} rounded`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{errorType}</h3>
          <div className="mt-1 text-sm">
            <p>{errorDescription}</p>
            {responseDataString && (
              <p className="mt-1 font-mono text-xs">
                {responseDataString}
              </p>
            )}
          </div>
          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ErrorHandler;
