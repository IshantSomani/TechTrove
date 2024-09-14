import React from "react";
import { Link, NavLink } from "react-router-dom";
import { HomeIcon, CpuChipIcon, PhoneIcon, UserIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const NavBar = ({ toggleTheme, isMenuOpen, isDark, setIsMenuOpen }) => {

  const menuItems = [
    { category: "All List", icon: HomeIcon, path: "/" },
    { category: "AI Categories", icon: CpuChipIcon, path: "/ai-categories" },
    { category: "Contact Us", icon: PhoneIcon, path: "/contact" }
  ];

  return (
    <nav className={`
      ${isMenuOpen ? 'block sticky top-[68px] z-50' : 'hidden'} lg:block
      lg:w-64 p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} 
      lg:h-screen lg:sticky lg:top-0 
      transition-all duration-300 ease-in-out
    `}>
      <div className="flex flex-col h-full">
        <Link to={'/'} className="hidden lg:block text-2xl font-bold mb-8 pb-2 border-b border-gray-700">TechTrove</Link>
        <ul className="space-y-3 flex-grow">
          {menuItems.map((item) => (
            <li key={item.category}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center p-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800')
                    : 'hover:bg-opacity-10 hover:bg-gray-500'}
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-6 h-6 mr-3" />
                <span className="font-medium">{item.category}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6 border-t border-gray-700">
          <button
            onClick={toggleTheme}
            className={`w-full p-3 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors duration-200 font-medium`}
          >
            {isDark ? (
              <>
                <SunIcon className="w-6 h-6 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <MoonIcon className="w-6 h-6 mr-2" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;