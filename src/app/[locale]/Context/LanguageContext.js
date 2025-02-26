'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { apiUrl, siteName } from '../Utils/variables';

const LanguageContext = createContext();

// LanguageProvider component
export function LanguageProvider({ children }) {

  const [translation, setTranslation] = useState([]); 
  // Fetch translations from an API endpoint
  const transalationData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/custom/v1/translations`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch footer menus");
      }
      const data = await response.json();
      setTranslation(data);
    } catch (error) {
      console.error(error);
    }
  };

  // const [language, setLanguage] = useState(() => {
  //   // Check if language is saved in cookies first
  //   if (typeof window !== 'undefined') {
  //     const savedLanguageFromCookie = 'en'; // Use the new cookie name
  //     if (savedLanguageFromCookie) {
  //       return savedLanguageFromCookie;
  //     }
  //   }
  //   return 'en'; // Default to 'en' if no saved language
  // });

  // Set language and direction when language changes
  useEffect(() => {
    transalationData();
    // if (typeof window !== 'undefined') {
    //   // Save language to cookies with a 30-day expiration
    //   Cookies.set(`${siteName}_language`, language, { expires: 30 }); // Use the new cookie name
    // }

    // // Set HTML attributes for language and direction
    // document.documentElement.setAttribute('lang', language);
    // document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      translation
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguageContext() {
  return useContext(LanguageContext);
}
