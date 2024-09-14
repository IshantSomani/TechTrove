import React, { lazy, Suspense, useContext, useState, useEffect } from "react";
import { createBrowserRouter, useLocation } from "react-router-dom";
import Layout from "../Layout";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import { ThemeContext } from "../context/ThemeContext";

const Home = lazy(() => import("../components/Home/Home"));
const AICategories = lazy(() => import("../components/CategoryGrid/AICategories"));
const AddTool = lazy(() => import("../components/AddTool/AddTool"));
const ContactUs = lazy(() => import("../components/ContactUs/ContactUs"));
const AdminAiTool = lazy(() => import("../components/Admin/AdminAiTool/AdminAiTool"));
const UserData = lazy(() => import("../components/Admin/UserData/UserData"));
const NotFound = lazy(() => import("../components/NotFound/NotFound"));

export const Loading = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`text-center p-4 max-w-sm mx-auto ${isDark ? 'text-white' : 'text-gray-800'}`}>
        <div className="inline-block animate-spin ease-linear rounded-full border-4 border-t-4 h-12 w-12 mb-4"
          style={{ borderTopColor: isDark ? '#60A5FA' : '#3B82F6', borderColor: isDark ? '#374151' : '#E5E7EB' }}
        ></div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Loading...</h2>
        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Please wait while we fetch the data.</p>
      </div>
    </div>
  );
};

// Popup Component
const Popup = ({ message, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div
        className={`
          p-8 rounded-lg shadow-2xl max-w-md w-full 
          transition-all duration-300 ease-in-out transform 
          ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
          scale-100 hover:scale-105
        `}
      >
        <h2 className={`text-2xl font-bold mb-4 text-center ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
          Welcome to the Home Page!
        </h2>
        <p className="text-lg mb-6 text-center leading-relaxed">
          {message}
        </p>
        <button
          onClick={onClose}
          className={`
            ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} 
            text-white font-bold py-3 px-6 rounded-full w-full 
            transition-colors duration-200 ease-in-out
            transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
          `}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// HomeWrapper Component
const HomeWrapper = () => {
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setShowPopup(true);
    }
  }, [location]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <Home />
      {showPopup && (
        <Popup
          message="If you'd like to contribute an AI tool for others, please contact us. Once approved, you can add your tool to our list, and your name will be proudly displayed in our 'Contributors' section."
          onClose={handleClosePopup}
        />
      )}
    </>
  );
};

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <HomeWrapper />
          </Suspense>
        ),
      },
      {
        path: "/ai-categories",
        element: (
          <Suspense fallback={<Loading />}>
            <AICategories />
          </Suspense>
        ),
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<Loading />}>
            <ContactUs />
          </Suspense>
        ),
      },
      {
        path: "/add-tool",
        element: (
          <Suspense fallback={<Loading />}>
            <AddTool />
          </Suspense>
        ),
      },
      {
        path: "/AdminAiTool",
        element: (
          <Suspense fallback={<Loading />}>
            <AdminAiTool />
          </Suspense>
        ),
      },
      {
        path: "/userData",
        element: (
          <Suspense fallback={<Loading />}>
            <UserData />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

export default Routes;