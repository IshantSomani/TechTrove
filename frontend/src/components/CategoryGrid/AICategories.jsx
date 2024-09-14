import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Header from "../Header/Header";
import ToolGrid from "../ToolGrid/ToolGrid";
import { useDispatch, useSelector } from "react-redux";
import { getAllAiTools } from "../../redux/slices/aiTool";
import NetworkError from "../ErrorBoundary/NetworkError";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import SortSelect from "../Home/SortSelect";

const AICategories = () => {
  const { theme } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();

  const { aiTools, status, error } = useSelector((state) => state.aiTool);
  const [sortCriteria, setSortCriteria] = useState('dateDesc');

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllAiTools());
    }
  }, [dispatch, status]);

  const handleCategoryClick = (category) => {
    if (category.url) {
      window.open(category.url, "_blank");
    } else {
      setSelectedCategory(category);
    }
  };

  const handleToolClick = (tool) => {
    if (tool?.url) {
      window.open(tool.url, "_blank");
    }
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  if (status === "failed") {
    return <NetworkError error={error} />;
  }

  return (
    <div className={`min-h-screen ${theme === "dark"
        ? "bg-gray-900 text-white"
        : "bg-gray-100 text-gray-900"
        }`}
    >
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {selectedCategory ? (
          <div>
            <div className="flex item-center justify-between">

              <button onClick={handleBackClick}
                className={`mb-6 px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 flex items-center ${theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Categories
              </button>
              <SortSelect theme={theme} sortCriteria={sortCriteria} handleSortChange={handleSortChange} />
            </div>
            <ToolGrid
              category={selectedCategory}
              theme={theme}
              handleToolClick={handleToolClick}
              sortCriteria={sortCriteria}
            />
          </div>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center">
              AI Categories
            </h1>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {aiTools.map((category) => (
                <div
                  key={category.id || category.category}
                  className={`p-4 rounded-xl shadow cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50"
                    }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center mb-3">
                    <h2 className="text-lg font-semibold">{category.category}</h2>
                  </div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {category.tools?.length || 0} tools available
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AICategories;
