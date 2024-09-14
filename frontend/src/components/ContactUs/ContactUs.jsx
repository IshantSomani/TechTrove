import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, getUserByEmail, oldUserMessage, resetStatus } from '../../redux/slices/user';
import ContactForm from './ContactForm';
import ThankYou from './ThankYou';
import { jwtDecode } from 'jwt-decode';

const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY_USER;

const ContactUs = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.user);

  const isDarkMode = useMemo(() => theme === 'dark', [theme]);

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      const decodedData = jwtDecode(storedData);
      setFormData(prevData => ({
        ...prevData,
        firstName: decodedData.firstName || '',
        lastName: decodedData.lastName || '',
        email: decodedData.email || ''
      }));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (status === 'succeeded') {
      setSubmitted(true);
      setFormData(prevData => ({ ...prevData, message: '' }));
      setIsLoading(false);
      const timer = setTimeout(() => {
        dispatch(resetStatus());
        setSubmitted(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (status === 'failed') {
      setIsLoading(false);
    }
  }, [status, dispatch]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const decodedData = storedData ? jwtDecode(storedData) : null;

      let result;
      if (!decodedData || decodedData.email !== formData.email) {
        result = await handleNewOrExistingUser();
      } else {
        result = await handleExistingUser(decodedData);
      }

      if (result && result.encryptedData) {
        localStorage.setItem(LOCAL_STORAGE_KEY, result.encryptedData);
        setSubmitted(true);
      } else {
        console.error('No encrypted data received from the server');
      }
    } catch (err) {
      console.error('Failed to submit message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, formData]);

  const handleNewOrExistingUser = async () => {
    try {
      return await dispatch(createUser(formData)).unwrap();
    } catch (createError) {
      if (createError.error === 'User already exists') {
        const existingUser = await dispatch(getUserByEmail(formData.email)).unwrap();
        return await dispatch(oldUserMessage({ userId: existingUser.user._id, message: formData.message.trim() })).unwrap();
      }
      throw createError;
    }
  };

  const handleExistingUser = async (decodedData) => {
    try {
      return await dispatch(oldUserMessage({ userId: decodedData._id, message: formData.message.trim() })).unwrap();
    } catch (err) {
      if (err.error === 'User not found') {
        return await dispatch(createUser(formData)).unwrap();
      }
      throw err;
    }
  };

  if (submitted) {
    return (
      <div className={`h-[90lvh] lg:min-h-[97vh] flex items-center justify-center px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <ThankYou isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className={`h-[90lvh] lg:min-h-[97vh] flex items-center justify-center px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-lg w-full rounded-lg shadow-xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-3xl font-extrabold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact Us</h2>
        {error && <ErrorMessage />}
        <ContactForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

const ErrorMessage = () => (
  <div className="rounded-md bg-red-50 p-3 m-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Error: please fill in proper details</h3>
      </div>
    </div>
  </div>
);

export default ContactUs;