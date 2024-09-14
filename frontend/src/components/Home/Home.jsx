import React, { useState, useContext, useEffect, useCallback } from "react";
import CategoryGrid from "../CategoryGrid/CategoryGrid";
import ToolGrid from "../ToolGrid/ToolGrid";
import { ThemeContext } from '../../context/ThemeContext';
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { getAllAiTools, hitCounts, clearError } from "../../redux/slices/aiTool";
import NetworkError from "../ErrorBoundary/NetworkError";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { jwtDecode } from "jwt-decode";
import SortSelect from "./SortSelect";

const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY;

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { aiTools, status, error } = useSelector((state) => state.aiTool);
  const [sortCriteria, setSortCriteria] = useState('dateDesc');

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const fetchData = useCallback(async () => {
    try {
      const result = await dispatch(getAllAiTools()).unwrap();
      if (result.encryptedData) {
        localStorage.setItem(LOCAL_STORAGE_KEY, result.encryptedData);
      }
      setHasNetworkError(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setHasNetworkError(true);
      const storedEncryptedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedEncryptedData) {
        try {
          const decodedData = jwtDecode(storedEncryptedData);
          dispatch(getAllAiTools.fulfilled({ aiTools: decodedData, encryptedData: storedEncryptedData }));
        } catch (decodeError) {
          console.error("Failed to decode stored data:", decodeError);
        }
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
    return () => {
      dispatch(clearError());
    };
  }, [fetchData, dispatch]);

  const handleToolClick = (tool, categoryId = selectedCategory?._id) => {
    if (tool?.url) {
      dispatch(hitCounts({ categoryId, aiToolId: tool._id }));
      window.open(tool.url, "_blank");
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleViewMore = (category) => {
    setSelectedCategory(category);
  };

  if (status === "failed" && !aiTools.length || hasNetworkError) {
    return <NetworkError error={error} />;
  }

  const currentCategory = selectedCategory
    ? aiTools.find(cat => cat._id === selectedCategory._id)
    : null;

  return (
    <div className={`min-h-[97svh] flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="space-y-6 sm:space-y-8">
          {currentCategory ? (
            <div className="space-y-6">
              <div className="flex item-center justify-between">
                <button
                  onClick={handleBackToCategories}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                    } shadow-md hover:shadow-lg`}
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Back to Categories
                </button>
                <SortSelect theme={theme} sortCriteria={sortCriteria} handleSortChange={handleSortChange} />
              </div>

              <ToolGrid
                category={currentCategory}
                theme={theme}
                handleToolClick={handleToolClick}
                sortCriteria={sortCriteria}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Explore AI Categories</h2>
              <CategoryGrid
                categories={aiTools}
                theme={theme}
                handleCategoryClick={handleCategoryClick}
                handleViewMore={handleViewMore}
                handleToolClick={handleToolClick}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;