import React from 'react';
import InputField from '../InputField/InputField';

const ContactForm = ({ formData, handleChange, handleSubmit, isLoading, isDarkMode }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex space-x-4">
        <div className="flex-1">
          <InputField
            label="First Name"
            id="firstName"
            type="text"
            placeholder="John"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="flex-1">
          <InputField
            label="Last Name"
            id="lastName"
            type="text"
            placeholder="Doe"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
      <InputField
        label="Email"
        id="email"
        type="email"
        placeholder="john@example.com"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        isDarkMode={isDarkMode}
      />
      <InputField
        label="Message"
        id="message"
        rows="4"
        placeholder="How can we help you?"
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
        isDarkMode={isDarkMode}
        isTextarea
      />
      <div>
        <button
          className={`w-full font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;