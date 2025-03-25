"use client";
import { useEffect, useRef, useState } from "react";


import "react-country-state-city/dist/react-country-state-city.css";
import {
  getTranslation,
  siteName,
} from "../../Utils/variables";

import { useCheckoutContext } from "../../Context/checkoutContext";
import FloatingLabelInput from "../FloatingLabelInput";



import "ol/ol.css";

import { useLanguageContext } from "../../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";


export default function GuestCheckoutAddressForm() {
 

  const params = useParams();  
  const locale = params.locale; 




  const { setValidateGuestCheckoutForm, billingAddress, setBillingAddress } =
    useCheckoutContext();

    const [country, setCountry] = useState("United Arab Emirates");
  const [street, setStreet] = useState("");
  const [houseName, setHousename] = useState("");
  const [state, setstate] = useState("");
  const [city, setCity] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const isValidEmail = (email) => {
    // Basic email regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email); // Returns true if email is valid, false otherwise
  };



    const { translation } = useLanguageContext();


  const handleSubmit = async (e) => {
   
   
    const isFormValid =
      firstName &&
      phone &&
      houseName &&
      street &&
      city &&
      state &&
      country &&
      isValidEmail(email);

    // If not valid, set the validation state to false
    if (!isFormValid) {
      setValidateGuestCheckoutForm(false); // Set form invalid state
      return; // Prevent submission
    }

    setValidateGuestCheckoutForm(true);

    setBillingAddress({
      firstName: firstName,
      lastName: "",
      country: country,
      houseName: houseName,
      street: street,
      landmark: "",
      state: state,
      city: city,
      pinCode: "",
      phone: phone,
      email: email,
    });
  };

  useEffect(() => {
    billingAddress
    handleSubmit();
  }, []);






  return (
    <form onChange={handleSubmit} autoComplete="none">
      <div className="grid gap-8">
        <FloatingLabelInput
          type="text"
          className={`${!firstName ? "border !border-red-400" : ""} input`}
          label={getTranslation(translation[0]?.translations,"First name",locale || 'en')}
          onChange={(e) => setFirstName(e.target.value)}
          required
          autoComplete="none"
          value={firstName}
        />

        <FloatingLabelInput
          type="number"
          className={`${!phone ? "border !border-red-400" : ""} input`}
          label={getTranslation(translation[0]?.translations,"Phone",locale || 'en')}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete="none"
          value={phone}
        />

        <FloatingLabelInput
          type="email"
          className={`${
            !isValidEmail(email) ? "border !border-red-400" : ""
          } input`}
          label={getTranslation(translation[0]?.translations,"Email",locale || 'en')}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
          autoComplete="none"
          value={email}
        />

      
        <FloatingLabelInput
          type="text"
          className={`${!houseName ? "border !border-red-400" : ""} input`}
          label={getTranslation(translation[0]?.translations,"Address",locale || 'en')}
          onChange={(e) => setHousename(e.target.value)}
          required
          autoComplete="none"
          value={houseName}
        />

        <FloatingLabelInput
          type="text"
          className={`${!street ? "border !border-red-400" : ""} input`}
          label={getTranslation(translation[0]?.translations,"Street",locale || 'en')}
          onChange={(e) => setStreet(e.target.value)}
          required
          autoComplete="none"
          value={street}
        />

        <FloatingLabelInput
          type="text"
          className={`${!city ? "border !border-red-400" : ""} input`}
          label={getTranslation(translation[0]?.translations,"City",locale || 'en')}
          onChange={(e) => setCity(e.target.value)}
          required
          autoComplete="none"
          value={city}
        />

        <FloatingLabelInput
          type="text"
          className={`${!state ? "border !border-red-400" : ""} input`}
          label={getTranslation(translation[0]?.translations,"State",locale || 'en')}
          onChange={(e) => setstate(e.target.value)}
          required
          autoComplete="none"
          value={state}
        />

<div className="w-full">
          {/* <label className=" bg-white block mb-2 transform transition-all cursor-pointer text-start label-input w-fit   uppercase text-primary  text-[12px] ">
            {getTranslation(translation[0]?.translations, "Country", locale)}
          </label> */}
          <select
            className="input w-full"
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value={country} selected>
              {getTranslation(translation[0]?.translations, country, locale)}
            </option>
            <option value="Bahrain">
              {getTranslation(translation[0]?.translations, "Bahrain", locale)}
            </option>
            <option value="Kuwait">
              {getTranslation(translation[0]?.translations, "Kuwait", locale)}
            </option>
            <option value="Oman">
              {getTranslation(translation[0]?.translations, "Oman", locale)}
            </option>
            <option value="Qatar">
              {getTranslation(translation[0]?.translations, "Qatar", locale)}
            </option>
            <option value="Saudi Arabia">
              {getTranslation(
                translation[0]?.translations,
                "Saudi Arabia",
                locale
              )}
            </option>
            <option value="United Arab Emirates">
              {getTranslation(
                translation[0]?.translations,
                "United Arab Emirates",
                locale
              )}
            </option>
          </select>
        </div>

        {/* <FloatingLabelInput
          type="text"
          className={`${!country ? "border !border-red-400" : ""} input`}
          label={getTranslation(translation[0]?.translations,"Country",locale || 'en')}
          onChange={(e) => setCountry(e.target.value)}
          required
          autoComplete="none"
          value={country}
        /> */}

     
      </div>
    </form>
  );
}
