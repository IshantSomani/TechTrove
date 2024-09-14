import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = ({ isDarkMode }) => {
  return (
    <div className={`h-[90lvh] lg:min-h-[97vh] flex items-center justify-center px-4 py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-10 transition-all duration-300`}>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Thank You!
          </h2>
          <div className="mt-8 flex items-center justify-center">
            <svg className={`h-16 w-16 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-6">
          <p className={`text-center text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Your message has been successfully sent.
          </p>
          <p className={`text-center text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            We'll get back to you soon.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/add-tool"
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105`}
          >
            Add a New Tool
            <span className="absolute right-4 inset-y-0 flex items-center">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;