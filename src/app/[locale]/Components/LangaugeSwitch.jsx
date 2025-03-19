"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; // To get the current path
import { useState } from "react"; // Import useState for loading state
import LoadingItem from "./LoadingItem";

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path (e.g., '/about-us')
  
  const [loading, setLoading] = useState(false); // Loading state

  const handleLanguageToggle = async () => {
    setLoading(true); // Set loading state to true when the button is clicked

    // Detect the current language from the URL
    const currentLanguage = pathname.startsWith("/ar") ? "ar" : "en";
    const newLanguage = currentLanguage === "en" ? "ar" : "en"; // Toggle the language

    // Remove the current language part from the pathname
    const currentPath = pathname.replace(/^\/(en|ar)/, "");

    // Change the URL to reflect the selected language and keep the current path
    router.push(`/${newLanguage}${currentPath}`).finally(() => {
      setLoading(false); // Set loading state to false after navigation
    });
  };

  return (
    <div
      className={`${
        pathname.startsWith("/en") ? 'arabic-font' : ''
      } text-white text-[12px] cursor-pointer py-1 px-2 flex items-center justify-center`}
      onClick={handleLanguageToggle}
    >
      {loading ? (
        <LoadingItem dot classes="size-4 text-white"/>
      ) : (
        <span>{pathname.startsWith("/en") ? "عربي" : "English"}</span>
      )}
    </div>
  );
};

export default LanguageSelector;
