import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import AddToolForm from "./AddToolForm";

const AddTool = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  return (
    <div className={`h-[90lvh] lg:min-h-[97vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`max-w-md w-full space-y-4 rounded-xl shadow-2xl px-8 py-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className={`text-3xl font-extrabold text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Add New AI Tool
        </h2>
        <AddToolForm isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default AddTool;