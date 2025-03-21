"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "./Context/authContext";
import { CartProvider } from "./Context/cartContext";
import { CheckoutProvider } from "./Context/checkoutContext";
import { SiteProvider } from "./Context/siteContext";
import ConfirmAge from "./Components/ConfirmAge";
import { siteName } from "./Utils/variables";
import Cookies from "js-cookie";
import { LanguageProvider } from "./Context/LanguageContext";
import { JwtProvider } from "./Context/jwtContext";
import useOnlineStatus from "./hooks/useOnlineStatus";
import Images from "./Components/Images";


export default function ClientProvider({ children }) {
  const [age, setAge] = useState(false);
  const [showConfirmAge, setShowConfirmAge] = useState(false);
  const isOnline = useOnlineStatus();
  const isAgeConfirmed = Cookies.get(`${siteName}_ageConfirmed`);
  const [showNoInternet, setShowNoInternet] = useState(false);

  useEffect(() => {
    setAge(isAgeConfirmed);

    const timeoutId = setTimeout(() => {
      if (!isAgeConfirmed) {
        setShowConfirmAge(true);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isAgeConfirmed]);

  // const handleRetry = () => {
  //   location.reload();
  // };

  // if (loading) {
  //   return null;
  // }


  useEffect(() => {
    if (!isOnline) {
      setShowNoInternet(true);
    } else {
      setShowNoInternet(false);
    }
  }, [isOnline]);

  if (showNoInternet) {
    return (
      <section className="pb-0 grid sm:gap-10 gap-6 sm:pt-20 pt-8 text-center h-screen">
      <div className="container container-fixed grid items-center justify-center h-[70vh]">
        <div className="grid px-5">
          <h1 className="text-lg  sm:text-3xl text-center text-primary mt-5">
          No Internet Connection!
   </h1>
<p className="mt-3">Please check your network connection and try again.</p>
          <div>
            {/* <button
              onClick={handleRetry}
              className="btn btn-primary mt-7 sm:mt-10"
            >
              Try Again
            </button> */}
          </div>
        </div>
      </div>
      {/* <Images
        imageurl="/images/brand-bg.webp"
        quality="100"
        width="1500"
        height="300"
        alt="Bynuna"
        title="Bynuna"
        classes="block w-full mx-auto absolute bottom-0"
        placeholder={true}
      /> */}
    </section>
    );
  }

  return (
    <AuthProvider>
      <JwtProvider>
        <LanguageProvider>
          <CartProvider>
            <CheckoutProvider>
              <SiteProvider>


              {!showNoInternet && children}
               

                {/* Show age confirmation modal if not confirmed */}
                {!age && showConfirmAge && <ConfirmAge />}
              </SiteProvider>
            </CheckoutProvider>
          </CartProvider>
        </LanguageProvider>
      </JwtProvider>
    </AuthProvider>
  );
}
