"use client";

import { useRouter } from "nextjs-toploader/app";
import { homeUrl, getTranslation, siteName } from "../Utils/variables";
import { useAuthContext } from "../Context/authContext";
import Cookies from "js-cookie"; // Import js-cookie
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams } from "next/navigation";


export default function Logout({ small}) {
 const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 

  const {
    setAuth,
    setUserToken,
    setUserData,
    setUser,
    setLoadingAuth,
    setValidUserTocken,
  } = useAuthContext();


  const { translation } = useLanguageContext();

  const handleLogout = () => {
    // Clear cookies
    Cookies.remove(`${siteName}_token`);
    Cookies.remove(`${siteName}_user_email`);
    Cookies.remove(`${siteName}_u_id`);
    // sessionStorage.removeItem('wishlist_data');

    // Reset context and state
    setAuth(false);
    setUserToken("");
    setUserData([]);
    setUser(null);
    setLoadingAuth(true);
    setValidUserTocken(null);

    // Redirect to the login page
    router.push(`${homeUrl}${locale}/auth/login?mainLogin=true`);
  };

  return (
    <>
      {small ? (
        <span
          onClick={handleLogout}
          className="hover:bg-primary hover:text-white cursor-pointer rounded-none primary-font"
        >
          {getTranslation(translation[0]?.translations, "Logout", locale || 'en')}
        </span>
      ) : (
        <div className="px-4 pt-3 sm:pb-4">
          <button onClick={handleLogout} className="btn-account">
            {getTranslation(translation[0]?.translations, "Logout", locale || 'en')}
          </button>
        </div>
      )}
    </>
  );
}
