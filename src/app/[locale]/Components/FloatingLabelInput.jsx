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
  className
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null); // Create a ref for the input

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

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={id}
          value={value}
          name={name}
          placeholder={focused ? "" : label}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...(required ? { required: true } : {})}
          ref={inputRef}
          className={`${className} peer w-full input !min-h-24  placeholder-transparent text-[14px] placeholder:text-[12px]`}
        >
          {" "}
        </textarea>
      ) : defaultValue ? (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue || ""}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...(required ? { required: true } : {})}
          className={`peer w-full input  placeholder-transparent text-[14px] placeholder:text-[12px] ${className} ${
            focused || value ? "pt-5" : "pt-3"
          }`}
          placeholder={focused ? "" : label}
          ref={inputRef} // Attach the ref to the input
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...(required ? { required: true } : {})}
          className={`peer w-full input  placeholder-transparent text-[14px] placeholder:text-[12px] ${className} `}
          placeholder={focused ? "" : label}
          ref={inputRef} // Attach the ref to the input
        />
      )}
      {textarea ? (
        <label
          htmlFor={id}
          className={`absolute bg-white transform uppercase transition-all cursor-pointer text-start label-input w-fit ${
            focused || value || defaultValue
              ? "top-[-8px] sm:top-[-12px] text-primary uppercase left-3 text-[12px]"
              : "top-[20px] text-[14px] left-4 -translate-y-1/2  w-[80%] "
          }`}
          onClick={handleLabelClick} // Use the new click handler
        >
          {label}
        </label>
      ) : (
        <label
          htmlFor={id}
          className={`absolute bg-white uppercase transform transition-all cursor-pointer text-start label-input w-fit  ${
            focused || value || defaultValue
              ? "top-[-8px] sm:top-[-12px] uppercase text-primary left-2 text-[12px] "
              : "top-1/2 text-[14px] left-3 -translate-y-1/2  w-[80%] "
          }`}
          onClick={handleLabelClick} // Use the new click handler
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default FloatingLabelInput;
