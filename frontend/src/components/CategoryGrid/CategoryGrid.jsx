import React from "react";
import { ArrowTopRightOnSquareIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const CategoryGrid = ({
  categories,
  theme,
  handleCategoryClick,
  handleViewMore,
  handleToolClick,
}) => {
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 ">
      {categories?.map((category) => (
        <div
          key={category._id}
          className={`flex flex-col h-full rounded-lg shadow hover:shadow-lg transition-all duration-300 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
        >
          <div
            className={`p-4 sm:p-6 flex-grow cursor-pointer ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
              }`}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-base font-bold truncate flex items-center">
                {category.category}
              </h2>
            </div>
            <ul className="space-y-2 sm:space-y-3 mb-1">
              {category.tools.slice(0, 5).map((tool, i) => (
                <li
                  key={tool._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center flex-grow mr-2 ">
                    <span
                      className={`mr-2 font-semibold text-center content-center w-[11%] ${isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                      {i + 1}.
                    </span>
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${tool.url}`}
                      alt={`${tool.title} favicon`}
                      className="mr-2 w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span
                      className="text-pretty text-xs sm:text-sm hover:text-blue-500 transition-colors duration-200 hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToolClick(tool, category._id);
                      }}
                    >
                      {tool.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-end relative right-0">
                    <span className="text-xs text-gray-500 mr-2">
                      {tool.hitCount}
                    </span>
                    <ArrowTopRightOnSquareIcon
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToolClick(tool, category._id);
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div
            className={`p-3 sm:p-4 text-center cursor-pointer rounded-b-md transition-colors duration-300 ${isDark
              ? "bg-gray-700 text-blue-400 hover:bg-gray-600 hover:text-blue-300"
              : "bg-gray-200 text-blue-600 hover:bg-gray-300 hover:text-blue-500"
              }`}
            onClick={() => handleViewMore(category)}
          >
            <span className="text-xs sm:text-sm font-medium">
              View all {category.tools.length} tools
            </span>
            <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 inline-block ml-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;