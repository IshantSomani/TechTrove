import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ThemeContext } from "./context/ThemeContext";
import { useDispatch, useSelector } from 'react-redux';
import { getAllAiTools, hitCounts } from './redux/slices/aiTool';
import NavBar from './components/NavBar/NavBar';
import { XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import Menu from './assets/Menu';

function Layout() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const { aiTools, status } = useSelector((state) => state.aiTool);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllAiTools());
    }
  }, [dispatch, status]);

  const allTools = aiTools.flatMap(category =>
    category.tools.map(tool => (
      { ...tool, categoryId: category._id }
    ))
  );

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleToolClick = (tool) => {
    dispatch(hitCounts({ categoryId: tool.categoryId, aiToolId: tool._id }));
    window.open(tool.url, "_blank");
  };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header isDark={isDark} toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} toggleTheme={toggleTheme} />
      <NavBar toggleTheme={toggleTheme} isMenuOpen={isMenuOpen} isDark={isDark} setIsMenuOpen={setIsMenuOpen} />
      <main className="flex-grow lg:flex-1 overflow-auto lg:p-2">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer isDark={isDark} allTools={allTools} handleToolClick={handleToolClick} />
    </div>
  );
}

export default Layout;

// Header Component
const Header = ({ isDark, toggleMenu, isMenuOpen, toggleTheme }) => (
  <header className={`lg:hidden sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
    <div className={`p-4 lg:hidden sticky top-0 text-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} flex items-center justify-between`}>
      <button
        className={`lg:hidden p-1 rounded-md ${isDark ? 'text-white' : 'text-gray-900'}`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Menu className="w-6 h-6" fill={`${isDark ? '#fff' : '#111827'}`} />
        )}
      </button>
      <Link to={'/'} className="font-bold lg:hidden">TechTrove</Link>
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        {isDark ? (
          <SunIcon className="h-5 w-5 text-blue-400" />
        ) : (
          <MoonIcon className="h-5 w-5 text-gray-700" />
        )}
      </button>
    </div>
  </header>
);

// Footer Component
const Footer = ({ isDark, allTools, handleToolClick }) => {
  const sortedTools = useMemo(() => {
    return [...allTools].sort((a, b) => a.title.localeCompare(b.title));
  }, [allTools]);

  const uniqueContributors = useMemo(() => {
    // Create an object to store the latest updatedAt for each contributor
    const contributorLatestUpdate = allTools.reduce((acc, tool) => {
      if (!acc[tool.addedBy] || new Date(tool.updatedAt) > new Date(acc[tool.addedBy])) {
        acc[tool.addedBy] = tool.updatedAt;
      }
      return acc;
    }, {});

    // Create an array of [contributor, latestUpdateTime] pairs
    const contributorsWithTime = Object.entries(contributorLatestUpdate);

    // Sort the array based on the updatedAt time (most recent first)
    contributorsWithTime.sort((a, b) => new Date(b[1]) - new Date(a[1]));

    // Return only the contributor names
    return contributorsWithTime.map(([contributor]) => contributor);
  }, [allTools]);

  const toolCount = allTools.length;
  const contributorsCount = uniqueContributors.length;

  return (
    <footer className={`
      relative bottom-0 
      lg:w-64 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} 
      p-6 flex flex-col
      lg:sticky lg:top-0 lg:h-screen 
      border-t lg:border-t-0 lg:border-l ${isDark ? 'border-gray-700' : 'border-gray-200'}
    `}>
      <div className="flex-grow overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold mb-4">Total Tool List: {toolCount}</h2>
        <div className="mb-4 flex-grow overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Quick Access</h3>
          <div className="overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto flex-grow">
            <div className="flex lg:grid lg:grid-cols-4 gap-4 py-2 pr-3 content-start">
              {sortedTools.map((tool) => (
                <button
                  key={tool._id}
                  onClick={() => handleToolClick(tool)}
                  className="transition-transform duration-300 hover:scale-110 flex flex-col items-center justify-center min-w-[50px] max-w-[80px]"
                  title={tool.title}
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${tool.url}&sz=64`}
                    alt={`${tool.title} favicon`}
                    className="w-7 h-7 rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Contributors: {contributorsCount}</h3>
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[100px]">
            {uniqueContributors.map((contributor, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {contributor}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={`text-center mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <p className="text-sm">© {new Date().getFullYear()} TechTrove. All rights reserved.</p>
      </div>
    </footer>
  );
};