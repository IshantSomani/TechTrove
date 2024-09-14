import React from 'react';

const InputField = ({ label, id, type, placeholder, name, value, onChange, required, disabled, isDarkMode, isTextarea, className = '' }) => {
  const baseClasses = `w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDarkMode
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-gray-300 text-gray-900"
    }`;

  const inputClasses = `${baseClasses} ${className}`;

  const labelClasses = `block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
    }`;

  return (
    <div>
      <label className={labelClasses} htmlFor={id}>
        {label}
      </label>
      {isTextarea ? (
        <textarea
          className={`${inputClasses} resize-none`}
          id={id}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          rows="4"
          required={required}
          disabled={disabled}
        />
      ) : (
        <input
          className={inputClasses}
          id={id}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default InputField;