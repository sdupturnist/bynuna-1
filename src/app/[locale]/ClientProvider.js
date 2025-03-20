"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "./Context/authContext";
import { CartProvider } from "./Context/cartContext";
import { CheckoutProvider } from "./Context/checkoutContext";
import { SiteProvider } from "./Context/siteContext";
import useNetworkStatus from "./Components/NetworkErrorPage"; // Assuming this hook exists
import ConfirmAge from "./Components/ConfirmAge";
import { siteName } from "./Utils/variables";
import Cookies from "js-cookie";
import { LanguageProvider } from "./Context/LanguageContext";
import { JwtProvider } from "./Context/jwtContext";
import Images from "./Components/Images";

export default function ClientProvider({ children }) {
  const { isOnline, loading } = useNetworkStatus();
  const [age, setAge] = useState(false);
  const [showConfirmAge, setShowConfirmAge] = useState(false);

  const isAgeConfirmed = Cookies.get(`${siteName}_ageConfirmed`);

  useEffect(() => {
    setAge(isAgeConfirmed);

    const timeoutId = setTimeout(() => {
      if (!isAgeConfirmed) {
        setShowConfirmAge(true);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isAgeConfirmed]);

  const handleRetry = () => {
    location.reload();
  };

  if (loading) {
    return null;
  }

  return (
    <AuthProvider>
      <JwtProvider>
        <LanguageProvider>
          <CartProvider>
            <CheckoutProvider>
              <SiteProvider>
                {/* Only show the offline message when the user is offline */}
                {!isOnline ? (
                  <section className="pb-0 grid sm:gap-10 gap-6 sm:pt-20 pt-8 text-center h-screen">
                    <div className="container container-fixed grid items-center justify-center h-[70vh]">
                      <div className="grid">
                        <Images
                          imageurl="/images/wifi.png"
                          quality="100"
                          width="250"
                          height="250"
                          alt="You are offline. Please check your internet connection."
                          title="You are offline. Please check your internet connection."
                          classes="block sm:w-[120px] w-[100px] opacity-60 mx-auto"
                          placeholder={true}
                        />
                        <h1 className="heading-lg  text-center text-primary mt-5">
                          You are offline. Please check your internet
                          connection.
                        </h1>

                        <div>
                          <button
                            onClick={handleRetry}
                            className="btn btn-primary mt-7 sm:mt-10"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    </div>
                    <Images
                      imageurl="/images/brand-bg.webp"
                      quality="100"
                      width="1500"
                      height="300"
                      alt="Bynuna"
                      title="Bynuna"
                      classes="block w-full mx-auto absolute bottom-0"
                      placeholder={true}
                    />
                  </section>
                ) : (
                  children
                )}

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
