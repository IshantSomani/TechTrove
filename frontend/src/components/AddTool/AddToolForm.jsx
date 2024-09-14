import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { aiToolsByUser } from '../../redux/slices/user';
import { jwtDecode } from 'jwt-decode';
import InputField from '../InputField/InputField';
import { useNavigate } from 'react-router-dom';

const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY_USER;

const AddToolForm = ({ isDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    url: "",
    description: "",
    username: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const decodedData = jwtDecode(storedData);
        const username = `${decodedData.firstName || ''} ${decodedData.lastName || ''}`.trim();
        setFormData(prevState => ({
          ...prevState,
          username: username
        }));
      } catch (error) {
        console.error("Error decoding user data:", error);
      }
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const decodedData = jwtDecode(storedData);
        if (decodedData._id) {
          dispatch(aiToolsByUser({ userId: decodedData._id, aitool: formData }));
          console.log("Form submitted:", formData);
          setFormData(prevState => ({
            ...prevState,
            category: "",
            title: "",
            url: "",
            description: "",
          }));
          navigate('/');
        } else {
          console.error("User ID is missing");
        }
      } catch (error) {
        console.error("Error decoding user data:", error);
      }
    } else {
      console.error("User data not found in local storage");
    }
  }, [dispatch, formData, navigate]);

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <InputField
          label="Username"
          id="username"
          type="text"
          placeholder="Your username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          disabled
          isDarkMode={isDarkMode}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Category"
            id="category"
            type="text"
            placeholder="e.g., Image Generation"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
          />
          <InputField
            label="Site Name"
            id="title"
            type="text"
            placeholder="e.g., AI Image Creator"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="relative">
          <InputField
            label="Link"
            id="url"
            type="url"
            placeholder="https://example.com"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
            className="pr-10"
          />
          {formData.url && (
            <div className="absolute top-10 bg-inherit right-3 flex items-center pointer-events-none">
              <img
                src={`https://www.google.com/s2/favicons?domain=${formData.url}&sz=32`}
                alt="Website Icon"
                className="w-5 h-5"
              />
            </div>
          )}
        </div>
        <InputField
          label="Description"
          id="description"
          placeholder="Briefly describe the AI tool..."
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          isDarkMode={isDarkMode}
          isTextarea
        />
      </div>
      <div>
        <button className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isDarkMode
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-500 hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105`}
          type="submit"
        >
          Add Tool
        </button>
      </div>
    </form>
  );
};

export default AddToolForm;