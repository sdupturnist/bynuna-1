"use client";
import { useState } from "react";

import "react-country-state-city/dist/react-country-state-city.css";
import { apiUrl, getTranslation } from "../../Utils/variables";
import { useCheckoutContext } from "../../Context/checkoutContext";
import { useAuthContext } from "../../Context/authContext";
import FloatingLabelInput from "../FloatingLabelInput";
import { useLanguageContext } from "../../Context/LanguageContext";
import "ol/ol.css";
import { useSiteContext } from "../../Context/siteContext";
import Alerts from "../Alerts";
import { useParams, useRouter } from "next/navigation";

export default function AddNewAddressForm() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { setShowNewAddress, setSavedAddress } = useSiteContext();

  const { translation } = useLanguageContext();

  const { setShowAddNewAddress } = useCheckoutContext();

  const { userData } = useAuthContext();

  const [country, setCountry] = useState("United Arab Emirates");
  const [street, setStreet] = useState("");
  const [houseName, setHousename] = useState("");
  const [state, setstate] = useState("");
  const [city, setCity] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");

  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const requestData = {
      meta_data: [
        {
          key: "additional_addresses",
          value: {
            full_name: firstName,
            last_name: "",
            company: "",
            country: country,
            address_1: houseName,
            address_2: houseName,
            landmark: "",
            state: state,
            city: city,
            pincode: "",
            phone: phone,
            street: street,
          },
        },
      ],
    };

    try {
      // Submit the review
      const response = await fetch(
        `${apiUrl}wp-json/custom/v1/customer/${
          userData && userData?.id
        }/add-address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //  Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        setLoading(false);
        setStatus(true);

        setStatus(false);
        // onAddressAdded
        window.scrollTo(0, 0);
        setShowAddNewAddress(false);
        setShowNewAddress(false);
        // router.push(`${homeUrl}${locale}/account/address`)
        router.refresh();

        setCountry("");
        setstate("");
        setCity("");
        setFirstName("");
        setPhone("");
        setStreet("");
        setHousename("");

        try {
          const addressResponse = await fetch(
            `${apiUrl}wp-json/custom/v1/customer/${
              userData && userData?.id
            }/get-addresses`,
            {
              next: { revalidate: 60 },
            }
          );
          const addressResponseData = await addressResponse.json();
          setSavedAddress(addressResponseData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        const errorResponse = await response.json();
        console.error("Failed to save address", response.status, errorResponse);
        setError(true);
        setLoading(false);
        setStatus(false);
      }
    } catch (error) {
      // setError(true);
      // setLoading(false);
      // setStatus(false);
      // console.error("An error occurred:", error);
    } finally {
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="none">
      <div className="grid gap-8">
        {status && (
          <Alerts
            status="green"
            title={getTranslation(
              translation[0]?.translations,
              "You have successfully added your new address.",
              locale
            )}
          />
        )}
        {error && (
          <Alerts
            status="red"
            title={getTranslation(
              translation[0]?.translations,
              "There was an issue adding your new address. Please try again.",
              locale
            )}
          />
        )}
        <FloatingLabelInput
          type="text"
          className="input"
          label={getTranslation(
            translation[0]?.translations,
            "Full Name",
            locale
          )}
          name="firstName"
          onChange={(name, value) => setFirstName(value)}
          required
          autoComplete="none"
          value={firstName}
          alphabet
        />

        <FloatingLabelInput
         type="tel"
          className="input"
          label={getTranslation(translation[0]?.translations, "Phone", locale)}
          name="phone"
          onChange={(name, value) => setPhone(value)}
          required
          autoComplete="none"
          value={phone}
          phoneNumber
        />

        <FloatingLabelInput
          type="text"
          className="input"
          label={getTranslation(
            translation[0]?.translations,
            "Address",
            locale
          )}
          name="houseName"
          onChange={(name, value) => setHousename(value)}
          required
          autoComplete="none"
          value={houseName}
        />

        <FloatingLabelInput
          type="text"
          className="input"
          label={getTranslation(translation[0]?.translations, "Street", locale)}
         name="street"
          onChange={(name, value) => setStreet(value)}
          required
          autoComplete="none"
          value={street}
          
        />

        <FloatingLabelInput
          type="text"
          className="input"
          label={getTranslation(translation[0]?.translations, "City", locale)}
          name="city"
          onChange={(name, value) => setCity(value)}
          required
          autoComplete="none"
          value={city}
          alphaNuemricOnly
        />

        <FloatingLabelInput
          type="text"
          className="input"
          label={getTranslation(translation[0]?.translations, "State", locale)}
        name="state"
          onChange={(name, value) => setstate(value)}
          required
          autoComplete="none"
          value={state}
          alphaNuemricOnly
        />

        <div className="w-full">
          <select
            className="input w-full"
            onChange={(e) => setCountry(e.target.value)}
            
          >
            <option value={country} defaultValue={country}>
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
        <div>
          <button
            disabled={loading}
            className="btn btn-primary btn-mobile-full"
            type="submit"
          >
            {loading ? (
              <>
                {getTranslation(
                  translation[0]?.translations,
                  "Save in progress...",
                  locale
                )}
              </>
            ) : (
              getTranslation(
                translation[0]?.translations,
                "Save address",
                locale
              )
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
