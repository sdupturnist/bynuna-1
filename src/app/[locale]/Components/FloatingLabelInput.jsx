"use client";
import { useState, useEffect, useRef } from "react";

const FloatingLabelInput = ({
  label,
  id,
  name,
  value,
  onChange,
  defaultValue = "",
  type = "text",
  required = false,
  textarea = false,
  className = "",
  password = false,
  alphaNuemricOnly = false,
  alphabet = false,
  phoneNumber = false,
}) => {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleFocus = () => setFocused(true);

  const handleBlur = () => {
    if (!(value || defaultValue)) setFocused(false);
  };

  useEffect(() => {
    if (value || defaultValue) setFocused(true);
  }, [value, defaultValue]);

  const handleLabelClick = () => {
    setFocused(true);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value;

    // Allow only numbers
    if (phoneNumber) {
      inputValue = inputValue.replace(/[^0-9]/g, "");
    }
    // Allow only alphabetic characters and spaces
    else if (alphabet) {
      inputValue = inputValue.replace(/[^a-zA-Z\s]/g, "");
    }
    // Allow only alphanumeric characters and spaces
    else if (alphaNuemricOnly) {
      inputValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, "");
    }

    // Pass the updated value to the parent component
    onChange?.(name, inputValue);
  };

  const commonProps = {
    id,
    name,
    onChange: handleInputChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    required,
    ref: inputRef,
    placeholder: focused ? "" : label,
    className: `peer w-full input placeholder-transparent text-[14px] placeholder:text-[12px] ${className} ${
      focused || value || defaultValue ? "sm:pt-5 pt-5" : "pt-3"
    }`,
    ...(phoneNumber ? { inputMode: "numeric", maxLength: 15 } : {}),
    ...(value !== undefined ? { value } : { defaultValue }), // 👈 allow fallback to defaultValue
  };

  const renderInput = () => {
    if (password) {
      return (
        <div style={{ position: "relative" }}>
          <input
            {...commonProps}
            type={passwordVisible ? "text" : "password"}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            tabIndex={-1}
          >
            <i
              className={
                passwordVisible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"
              }
            />
          </button>
        </div>
      );
    }

    if (textarea) {
      return (
        <textarea
          {...commonProps}
          className={`peer w-full pt-3 input !min-h-24 placeholder-transparent text-[14px] ${className}`}
        />
      );
    }

    return <input {...commonProps} type={type} />;
  };

  return (
    <div className="relative">
      {renderInput()}
      <label
        htmlFor={id}
        onClick={handleLabelClick}
        className={`absolute bg-white uppercase transform transition-all cursor-pointer text-start label-input w-fit ${
          focused || value || defaultValue
            ? "top-[-8px] sm:top-[-12px] text-primary left-3 text-[12px]"
            : "sm:top-[31px] top-[26px] text-[14px] left-4 -translate-y-1/2 w-[80%]"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;

// "use client";
// import { useState, useEffect, useRef } from "react";

// const FloatingLabelInput = ({
//   label,
//   id,
//   name,
//   value,
//   onChange,
//   type = "text",
//   required = false,
//   textarea = false,
//   className = "",
//   password = false,
//   alphaNuemricOnly = false,
//   alphabet = false,
//   phoneNumber = false,
// }) => {
//   const [focused, setFocused] = useState(false);
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const inputRef = useRef(null);

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const handleFocus = () => setFocused(true);

//   const handleBlur = () => {
//     if (!value) setFocused(false);
//   };

//   useEffect(() => {
//     if (value) setFocused(true);
//   }, [value]);

//   const handleLabelClick = () => {
//     setFocused(true);
//     inputRef.current?.focus();
//   };

//   const handleInputChange = (e) => {
//     let inputValue = e.target.value;

//     // ✅ Input filtering
//     if (phoneNumber) {
//       inputValue = inputValue.replace(/[^0-9]/g, "");
//     } else if (alphabet) {
//       inputValue = inputValue.replace(/[^a-zA-Z\s]/g, "");
//     } else if (alphaNuemricOnly) {
//       inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, "");
//     }

//     // Call the parent handler with the name and updated value
//     onChange(name, inputValue); // Pass name and value to parent
//   };

//   const commonProps = {
//     id,
//     name,
//     onChange: handleInputChange,
//     onFocus: handleFocus,
//     onBlur: handleBlur,
//     required,
//     ref: inputRef,
//     value: value || "",
//     placeholder: focused ? "" : label,
//     className: `peer w-full input placeholder-transparent text-[14px] placeholder:text-[12px] ${className} ${
//       focused || value ? "sm:pt-5 pt-5" : "pt-3"
//     }`,
//     ...(phoneNumber ? { inputMode: "numeric", maxLength: 15 } : {}),
//   };

//   const renderInput = () => {
//     if (password) {
//       return (
//         <div style={{ position: "relative" }}>
//           <input
//             {...commonProps}
//             type={passwordVisible ? "text" : "password"}
//           />
//           <button
//             type="button"
//             onClick={togglePasswordVisibility}
//             className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
//             tabIndex={-1}
//           >
//             <i
//               className={
//                 passwordVisible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"
//               }
//             />
//           </button>
//         </div>
//       );
//     }

//     if (textarea) {
//       return (
//         <textarea
//         {...commonProps}
//         className={`peer w-full pt-3 input !min-h-24 placeholder-transparent text-[14px] ${className}`}
//       />
//       );
//     }

//     return <input {...commonProps} type={type} />;
//   };

//   return (
//     <div className="relative">
//       {renderInput()}
//       <label
//         htmlFor={id}
//         onClick={handleLabelClick}
//         className={`absolute bg-white uppercase transform transition-all cursor-pointer text-start label-input w-fit ${
//           focused || value
//             ? "top-[-8px] sm:top-[-12px] text-primary left-3 text-[12px]"
//             : "sm:top-[31px] top-[26px] text-[14px] left-4 -translate-y-1/2 w-[80%]"
//         }`}
//       >
//         {label}
//       </label>
//     </div>
//   );
// };

// export default FloatingLabelInput;
