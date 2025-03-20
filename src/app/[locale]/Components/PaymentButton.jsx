"use client";

import { useAuthContext } from "../Context/authContext";
import { useCheckoutContext } from "../Context/checkoutContext";
import CashOnDeliveryPayment from "./CashOnDeliveryButton";
import TotalPay from "./TotalPay";


export default function PaymentButton({ message, type, onClose, locale, }) {
  
  const {userData} = useAuthContext()
  const { paymentMethodOption } = useCheckoutContext();



  return paymentMethodOption === "cod" ? (
    <CashOnDeliveryPayment userData={userData} locale={locale} />
  ) : (
    <TotalPay userData={userData} locale={locale} />
  );
}
