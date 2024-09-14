import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const NetworkError = ({ error }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`flex items-center justify-center h-[90lvh] lg:min-h-[97vh] ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`text-center p-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-xl max-w-md w-full`}>
        <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"} mb-4`}>
          Oops! Something went wrong
        </h2>
        <p className="text-red-500 text-lg mb-4">Error: {error}</p>
        <button onClick={() => window.location.reload()}
          className={`${theme === "dark" 
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
            } text-white font-bold py-2 px-4 rounded transition duration-300`}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default NetworkError;
