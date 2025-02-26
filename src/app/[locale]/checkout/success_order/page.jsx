'use client'



import Alerts from "../../Components/Alerts";
import { useCartContext } from "../../Context/cartContext";
import { useCheckoutContext } from "../../Context/checkoutContext";
import { homeUrl, siteName } from "../../Utils/variables";
import { useEffect } from "react";

export default function SuccessOrder() {
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
    <Alerts
      noLogo
      title="Thank you for your Order!"
      large
      url={homeUrl}
      desc={`We will keep you updated on your order status via the given email address. Alternatively, you can check your order status at My Account > Orders`}
    />
  );
}
