"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "./Context/authContext";
import { CartProvider } from "./Context/cartContext";
import { CheckoutProvider } from "./Context/checkoutContext";
import { SiteProvider } from "./Context/siteContext";
import useOnlineStatus from "./hooks/useOnlineStatus";
import Alerts from "./Components/Alerts";
import ConfirmAge from "./Components/ConfirmAge";
import { siteName } from "./Utils/variables";
import Cookies from "js-cookie";
import { LanguageProvider } from "./Context/LanguageContext";
import { JwtProvider } from "./Context/jwtContext";

export default function ClientProvider({ children }) {
  const isOnline = useOnlineStatus();
  const [showNoInternet, setShowNoInternet] = useState(false);
  const isAgeConfirmed = Cookies.get(`${siteName}_ageConfirmed`);

  const [age, setAge] = useState(false);
  const [showConfirmAge, setShowConfirmAge] = useState(false); // New state for confirming age

  useEffect(() => {
    setAge(isAgeConfirmed);

    if (!isOnline) {
      setShowNoInternet(true);
    } else {
      setShowNoInternet(false);
    }

    // Set timeout to show ConfirmAge after a certain time (e.g., 3 seconds)
    const timeoutId = setTimeout(() => {
      setShowConfirmAge(true);
    }, 2000); // 3000ms = 3 seconds

    // Cleanup the timeout when the component unmounts or when conditions change
    return () => clearTimeout(timeoutId);
  }, [isOnline, isAgeConfirmed]);

  if (showNoInternet) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-5 text-center text-xl bg-white z-50">
        <Alerts
          large
          title="No Internet Connection!"
          desc="Please check your network connection and try again."
          noPageUrl
        />
      </div>
    );
  }

  return (
    <AuthProvider>
      <JwtProvider>
        <LanguageProvider>
          <CartProvider>
            <CheckoutProvider>
              <SiteProvider>
                {!age && showConfirmAge && <ConfirmAge />}{" "}
                {/* Show after timeout */}
                {children}
              </SiteProvider>
            </CheckoutProvider>
          </CartProvider>
        </LanguageProvider>
      </JwtProvider>
    </AuthProvider>
  );
}
