import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from '../../context/ThemeContext';
import SearchBar from '../SearchBar/SearchBar'
import { useDispatch, useSelector } from "react-redux";
import { getAllAiTools } from "../../redux/slices/aiTool";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { aiTools, status, error } = useSelector((state) => state.aiTool);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllAiTools());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredCategories = aiTools.filter((category) =>
        category.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const allTools = aiTools.flatMap((category) => category.tools);
      const filteredTools = allTools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setRecommendations([...filteredCategories, ...filteredTools]);
      setShowRecommendations(true);
    } else {
      setRecommendations([]);
      setShowRecommendations(false);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleToolClick = (tool) => {
    if (tool) {
      window.open(tool.url, "_blank");
    }
  };

  return (
    <header className={`sticky top-0 z-20 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md transition-colors duration-300 `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold hidden lg:block">TechTrove</h1>
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            showRecommendations={showRecommendations}
            theme={theme}
            recommendations={recommendations}
            handleItemClick={(item) => handleToolClick(item)}
          />
        </div>
      </div>
    </header>
  )
}

export default Header