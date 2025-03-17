// context/CheckoutContext.js
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [amountToPay, setAmountToPay] = useState(0);
  const [billingAddress, setBillingAddress] = useState("");
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  const [updateAddress, setUpdateAddress] = useState([]);
  const [validateAddress, setValidateAddress] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMethodOption, setPaymentMethodOption] = useState("cod");
  const [paymentTerms, setPaymentTerms] = useState(false);
  const [validateTerms, setValidateTerms] = useState(false);
  const [updatePaymentStatus, setUpdatePaymentStatus] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [identificationTerms, setIdentificationsTerms] = useState(false);
  const [validateGuestCheckoutForm, setValidateGuestCheckoutForm] = useState(false);
  const [orderPlaceLoading, setOrderPlaceLoading] = useState(false);




  // useEffect(() => {
  //   setValidateAddress(false);
  // }, [validateAddress]); 

  return (
    <CheckoutContext.Provider
      value={{
        amountToPay,
        setAmountToPay,
        billingAddress,
        setBillingAddress,
        showAddNewAddress,
        setShowAddNewAddress,
        updateAddress,
        setUpdateAddress,
        validateAddress,
        setValidateAddress,
        paymentStatus,
        setPaymentStatus,
        paymentMethodOption,
        setPaymentMethodOption,
        paymentTerms,
        setIdentificationsTerms,
    identificationTerms,
        setPaymentTerms,
        validateTerms,
        setValidateTerms,
        updatePaymentStatus,
        setUpdatePaymentStatus,
        validateGuestCheckoutForm, setValidateGuestCheckoutForm,
        paymentId, 
        setPaymentId,
        orderPlaceLoading, setOrderPlaceLoading
      }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  return useContext(CheckoutContext);
};
