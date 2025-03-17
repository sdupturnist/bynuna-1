'use client'

import Alerts from "../../Components/Alerts";
import { useCartContext } from "../../Context/cartContext";
import { useCheckoutContext } from "../../Context/checkoutContext";
import { homeUrl, siteName } from "../../Utils/variables";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

export default function SuccessOrder() {
  // Using useSearchParams to safely get query parameters
  const searchParams = useSearchParams();
  const userType = searchParams?.get("user_type") || "account";  // Access query parameter properly

  console.log(userType);

  const {
    setCartItems,
    setCartSubTotal,
    setCartTotal,
    setCouponCode,
    setDiscount,
    setGuestUser,
  } = useCartContext();

  const { setValidateAddress, setValidateTerms, setPaymentTerms } =
    useCheckoutContext();

  useEffect(() => {
    typeof window !== "undefined" &&
      sessionStorage.removeItem(`${siteName}_order_data`);
    typeof window !== "undefined" &&
      sessionStorage.removeItem(`${siteName}_email_data`);

    setCartItems([]);
    setCartSubTotal(0);
    setCartTotal(0);
    setCouponCode(false);
    setDiscount(0);
    setValidateTerms(false);
    setValidateAddress(false);
    setPaymentTerms(false);
    setGuestUser(false);
  }, []);

  return (
    <>
      <Alerts
        check
        noLogo
        title="Thank you for your Order!"
        large
        url={homeUrl}
        desc={`We will keep you updated on your order status via the given email address. ${
          userType === "account"
            ? "Alternatively, you can check your order status at My Account > Orders"
            : ""
        } `}
      />
    </>
  );
}
