import React, { useContext } from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const ErrorBoundary = () => {
  const error = useRouteError();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  console.error(error);

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-8 text-center`}>
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Oops! Something went wrong</h1>
        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
          We're sorry, but an unexpected error has occurred. Our team has been notified and is working on a fix.
        </p>
        <div className={`${isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-500 text-red-700'} border-l-4 p-4 mb-6`}>
          <p className="font-bold">Error details:</p>
          <p className="italic">{error.statusText || error.message || 'Unknown error'}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => window.location.reload()}
            className={`inline-flex items-center px-4 py-2 border text-base font-medium rounded-md shadow-sm ${isDark
                ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;