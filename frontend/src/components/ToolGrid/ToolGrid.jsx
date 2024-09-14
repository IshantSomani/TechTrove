import React, { useMemo, useState } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

const ToolCard = ({ categoryId, tool, theme, onClick, toolNumber }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleDescriptionClick = (e) => {
    e.stopPropagation();
    setShowFullDescription(!showFullDescription);
  };

  const handleVisitClick = (e) => {
    e.stopPropagation();
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-md shadow-md relative cursor-pointer transition-all duration-300 ease-in-out ${theme === 'dark'
        ? 'bg-gray-800 hover:bg-gray-700'
        : 'bg-white hover:bg-gray-50'
        } hover:shadow-lg flex flex-col h-full`}
      onClick={() => onClick(tool, categoryId)}
    >
      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
        {toolNumber}
      </div>
      <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
        {tool.hitCount}
      </div>

      <div className="sticky top-0 bg-inherit pt-4 pb-2 z-10">
        <div className="flex flex-col items-center justify-center">
          <img
            src={`https://www.google.com/s2/favicons?domain=${tool.url}&sz=64`}
            alt={`${tool.title} favicon`}
            className="mb-3 w-12 h-12 rounded"
          />
          <h3 className={`text-lg font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {tool.title}
          </h3>
          <p className="text-xs mt-2 text-gray-500">
            Updated: {new Date(tool.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="sticky top-24 flex-grow overflow-y-auto max-h-40">
        <div className="mb-4">
          <p
            className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              } text-sm ${showFullDescription ? '' : 'line-clamp-3'
              } cursor-text text-center`}
            onClick={handleDescriptionClick}
          >
            {tool.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center mt-auto pt-4">
        <button
          onClick={handleVisitClick}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${theme === 'dark'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          <ArrowTopRightOnSquareIcon className="w-4 h-4 inline mr-1" />
          Visit Site
        </button>
      </div>
    </div>
  );
};

const ToolGrid = ({ category, theme, handleToolClick, sortCriteria }) => {
  const sortedTools = useMemo(() => {
    return [...category.tools].sort((a, b) => {
      switch (sortCriteria) {
        case 'dateDesc':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'dateAsc':
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        case 'alphaAsc':
          return a.title.localeCompare(b.title);
        case 'alphaDesc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [category.tools, sortCriteria]);

  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {category.category}
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTools.map((tool, index) => (
          <ToolCard
            categoryId={category._id}
            key={tool._id}
            tool={tool}
            theme={theme}
            onClick={handleToolClick}
            toolNumber={index + 1}
          />
        ))}
      </div>
    </div>
  )
};

export default ToolGrid;