import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const SearchBar = ({ searchTerm, handleSearch, showRecommendations, recommendations, handleItemClick }) => {
  const { theme } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter out duplicates and limit to top 10
  const uniqueRecommendations = recommendations.reduce((acc, current) => {
    const name = current.category || current.title;
    if (!acc.some(item => (item.category || item.title) === name)) {
      acc.push(current);
    }
    return acc;
  }, []).slice(0, 10);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="relative w-full lg:w-96">
      <input
        type="text"
        placeholder="Search AI tools or categories..."
        value={searchTerm}
        onChange={handleSearch}
        className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {showRecommendations && uniqueRecommendations.length > 0 && (
        <div className={`mt-2 rounded-lg shadow-lg absolute w-full z-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } max-h-96 overflow-y-auto`}>
          {selectedCategory ? (
            <div>
              <button
                onClick={handleBackClick}
                className={`p-3 w-full text-left ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
                  }`}
              >
                ← Back to search results
              </button>
              <ul>
                {selectedCategory.tools.map((tool, index) => (
                  <li
                    key={index}
                    onClick={() => handleItemClick(tool)}
                    className={`p-3 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                      }`}
                  >
                    <div className="flex items-center">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${tool.url}`}
                        alt={`${tool.title} favicon`}
                        className="mr-2 w-4 h-4"
                      />
                      <span className="truncate">{tool.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul>
              {uniqueRecommendations.map((item, index) => (
                <li
                  key={index}
                  onClick={() => item.category ? handleCategoryClick(item) : handleItemClick(item)}
                  className={`p-3 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                    }`}
                >
                  {item.category ? (
                    <span className="font-bold">{item.icon} {item.category}</span>
                  ) : (
                    <div className="flex items-center">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${item.url}`}
                        alt={`${item.title} favicon`}
                        className="mr-2 w-4 h-4"
                      />
                      <span className="truncate">{item.title}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;