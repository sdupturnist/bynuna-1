// "use client";

// import { useRouter } from "nextjs-toploader/app";
// import { useLanguageContext } from "../Context/LanguageContext";

// const LanguageSelector = () => {
//   const { language, setLanguage } = useLanguageContext();  // Use setLanguage directly
//   const router = useRouter();

//   const handleLanguageChange = (lang) => {
//     setLanguage(lang); // Directly set the language to the one clicked

//     // Delay the refresh by 1 second (1000ms)
//     setTimeout(() => {
//       router.refresh(); // Refresh the current route after 1 second
//     }, 1000);
//   };

//   const handleClick = () => {
//     const elem = document.activeElement;
//     if (elem) {
//       elem?.blur();
//     }
//   };

//   return (
// <div className="dropdown dropdown-end sm:text-xs text-[10px]">
//   <span tabIndex={0} className="text-white cursor-pointer">
//     {language === "en" ? "Arabic" : "English"}{" "}
//     {/* Button text showing current language */}
//   </span>
//   <ul
//     tabIndex={0}
//     className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
//   >
//     <li onClick={handleClick}>
//       <button
//         onClick={() => handleLanguageChange("ar")} // Set Arabic as selected language
//         className="w-full text-left p-2"
//       >
//         Arabic
//       </button>
//     </li>
//     <li onClick={handleClick}>
//       <button
//         onClick={() => handleLanguageChange("en")} // Set English as selected language
//         className="w-full text-left p-2"
//       >
//         English
//       </button>
//     </li>
//   </ul>
// </div>
//   );
// };

// export default LanguageSelector;
"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; // To get the current path

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path (e.g., '/about-us')

  const handleLanguageToggle = () => {
    // Detect the current language from the URL
    const currentLanguage = pathname.startsWith("/ar") ? "ar" : "en";
    const newLanguage = currentLanguage === "en" ? "ar" : "en"; // Toggle the language

    // Remove the current language part from the pathname
    const currentPath = pathname.replace(/^\/(en|ar)/, "");

    // Change the URL to reflect the selected language and keep the current path
    router.push(`/${newLanguage}${currentPath}`);
  };

  return (
    <div className={`${pathname.startsWith("/en") ? 'arabic-font' : ''} text-white text-[10px] cursor-pointer`} onClick={handleLanguageToggle}>
      {pathname.startsWith("/en") ? "عربي" : "English"}
    </div>
  );
};

export default LanguageSelector;
