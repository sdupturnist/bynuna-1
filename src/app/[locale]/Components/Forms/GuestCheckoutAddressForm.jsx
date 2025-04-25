"use client";
import { useEffect, useState } from "react";
import { useCheckoutContext } from "../../Context/checkoutContext";
import FloatingLabelInput from "../FloatingLabelInput";
import { getTranslation } from "../../Utils/variables";
import { useLanguageContext } from "../../Context/LanguageContext";
import { useParams } from "next/navigation";
import Alerts from "../Alerts";

export default function GuestCheckoutAddressForm() {
  const params = useParams();
  const locale = params.locale;

  const {
    setGuestCheckoutformData,
    guestCheckoutformData,
    validationError,
    checkFormValid,
    billingAddress,
    setBillingAddress,
  } = useCheckoutContext();

  const { translation } = useLanguageContext();

  const handleChange = (name, value) => {
    setGuestCheckoutformData({
      ...guestCheckoutformData,
      [name]: value,
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value); // Update the country field correctly
  };

  const handleFormChange = async (e) => {
    setBillingAddress({
      firstName: guestCheckoutformData.firstName,
      lastName: "",
      country: guestCheckoutformData.country,
      houseName: guestCheckoutformData.houseName,
      street: guestCheckoutformData.street,
      landmark: "",
      state: guestCheckoutformData.state,
      city: guestCheckoutformData.city,
      pinCode: "",
      phone: guestCheckoutformData.phone,
      email: guestCheckoutformData.email,
    });
  };

  useEffect(() => {
    billingAddress;
    handleFormChange();
  }, []);

  return (
    <form onChange={handleFormChange} autoComplete="none" noValidate>
      <div className="grid gap-8">
        {!checkFormValid && (
          <Alerts
            center
            status="red"
            title={getTranslation(
              translation[0]?.translations,
              "Please fill in all required fields or provide valid information, highlighted in red, before proceeding.",
              locale || "en"
            )}
          />
        )}

        <FloatingLabelInput
          name="firstName"
          type="text"
          className={`${
            validationError.firstName ? "border !border-red-400" : ""
          } input`}
          label={getTranslation(
            translation[0]?.translations,
            "Full Name",
            locale || "en"
          )}
          onChange={handleChange}
          required
          autoComplete="none"
          value={guestCheckoutformData.firstName}
          alphabet
        />

        <FloatingLabelInput
          name="phone"
          type="tel"
          className={`${
            validationError.phone ? "border !border-red-400" : ""
          } input `}
          label={getTranslation(
            translation[0]?.translations,
            "Phone",
            locale || "en"
          )}
          onChange={handleChange}
          required
          autoComplete="none"
          value={guestCheckoutformData.phone}
          phoneNumber
        />

        <FloatingLabelInput
          name="email"
          type="email"
          className={`${
            validationError.email ? "border !border-red-400" : ""
          } input`}
          label={getTranslation(
            translation[0]?.translations,
            "Email",
            locale || "en"
          )}
          onChange={handleChange}
          required
          autoComplete="none"
          value={guestCheckoutformData.email}
        />

        <FloatingLabelInput
          name="houseName"
          type="text"
          className={`${
            validationError.houseName ? "border !border-red-400" : ""
          } input`}
          label={getTranslation(
            translation[0]?.translations,
            "Address",
            locale || "en"
          )}
          onChange={handleChange}
          required
          autoComplete="none"
          value={guestCheckoutformData.houseName}
        />

        <FloatingLabelInput
          name="street"
          type="text"
          className={`${
            validationError.street ? "border !border-red-400" : ""
          } input`}
          label={getTranslation(
            translation[0]?.translations,
            "Street",
            locale || "en"
          )}
          onChange={handleChange}
          required
          autoComplete="none"
          value={guestCheckoutformData.street}
        />

        <FloatingLabelInput
          name="city"
          type="text"
          className={`${
            validationError.city ? "border !border-red-400" : ""
          } input`}
          label={getTranslation(
            translation[0]?.translations,
            "City",
            locale || "en"
          )}
          onChange={handleChange}
          required
          autoComplete="none"
          value={guestCheckoutformData.city}
          alphaNuemricOnly
        />

        <FloatingLabelInput
          name="state"
          type="text"
          className={`${
            validationError.state ? "border !border-red-400" : ""
          } input`}
          label={getTranslation(
            translation[0]?.translations,
            "State",
            locale || "en"
          )}
          onChange={handleChange}
          required
          autoComplete="none"
          value={guestCheckoutformData.state}
          alphaNuemricOnly
        />

        <div className="w-full">
          <select
            name="country"
            className="input w-full"
            onChange={handleSelectChange} // Use handleSelectChange for select
            value={guestCheckoutformData.country} // Make sure the select is controlled
          >
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Oman">Oman</option>
            <option value="Qatar">Qatar</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
          </select>
        </div>
      </div>
    </form>
  );
}
