"use client";
import { useState, useEffect, useRef } from "react";

const FloatingLabelInput = ({
  label,
  id,
  name,
  value,
  defaultValue,
  onChange,
  type,
  required,
  textarea,
  className,
  password,
}) => {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef(null); // Create a ref for the input

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    if (!value) setFocused(false);
  };

  // Ensure that the label stays at the top when there is any value
  useEffect(() => {
    if (value) {
      setFocused(true);
    }
  }, [value]);

  // Focus the input when the label is clicked
  const handleLabelClick = () => {
    setFocused(true);
    inputRef.current?.focus(); // Focus the input programmatically
  };

  const renderInput = () => {
    switch (true) {
      case password: // For password field
        return (
          <div style={{ position: "relative" }}>
            <input
              id={id}
              name={name}
              type={passwordVisible ? "text" : "password"}
              defaultValue={defaultValue || ""}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...(required ? { required: true } : {})}
              className={`peer w-full input placeholder-transparent text-[14px] pr-10 placeholder:text-[12px] ${className} ${
                focused || value ? "sm:pt-5" : "pt-3"
              }`}
              placeholder={focused ? "" : label}
              ref={inputRef} // Attach the ref to the input
            />
            <i
              className={`fa show-password ${
                passwordVisible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"
              }`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        );

      case textarea: // For textarea
        return (
          <textarea
            id={id}
            value={value}
            name={name}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...(required ? { required: true } : {})}
            ref={inputRef}
            className={`${className} peer w-full pt-3 input !min-h-24 placeholder-transparent text-[14px] placeholder:text-[12px]`}
          />
        );

      default: // For default input type
        return (
          <input
            id={id}
            name={name}
            type={type}
            value={value || ""}
            defaultValue={defaultValue || ""}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...(required ? { required: true } : {})}
            className={`peer w-full input placeholder-transparent text-[14px] placeholder:text-[12px] ${className} ${
              focused || value ? "sm:pt-5" : "pt-3"
            }`}
            placeholder={focused ? "" : label}
            ref={inputRef} // Attach the ref to the input
          />
        );
    }
  };

  return (
    <div className="relative">
      {renderInput()}
      <label
        htmlFor={id}
        className={`absolute bg-white uppercase transform transition-all cursor-pointer text-start label-input w-fit ${
          focused || value || defaultValue
            ? "top-[-8px] sm:top-[-12px] text-primary uppercase left-3 text-[12px]"
            : "sm:top-[31px] top-[26px] text-[14px] left-4 -translate-y-1/2 w-[80%]"
        }`}
        onClick={handleLabelClick} // Use the new click handler
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
