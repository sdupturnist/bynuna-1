"use client";
import { useEffect, useState } from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import { useParams, useRouter } from "next/navigation";
import { apiUrl, getTranslation } from "../../Utils/variables";
import Alerts from "../Alerts";
import { useAuthContext } from "../../Context/authContext";
import FloatingLabelInput from "../FloatingLabelInput";
import "ol/ol.css";
import { useLanguageContext } from "../../Context/LanguageContext";
import LoadingItem from "../LoadingItem";
import { useSiteContext } from "../../Context/siteContext";

export default function UpdateAddressForm() {
  const id = useParams();

  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const [updateAddress, setUpdateAddress] = useState([]);

  const { setSavedAddress } = useSiteContext();

  const fetchAddressData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/custom/v1/customer/${
          userData && userData?.id
        }/get-address/${id?.id}`
      );
      const data = await response.json();
      setUpdateAddress(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAddressData();
  }, []);

  useEffect(() => {
    if (updateAddress && Object.keys(updateAddress).length > 0) {
      setFirstName(updateAddress.full_name || "");
      setPhone(updateAddress.phone || "");
      setHousename(updateAddress.address_1 || "");
      setStreet(updateAddress.street || "");
      setCity(updateAddress.city || "");
      setstate(updateAddress.state || "");
      setCountry(updateAddress.country || "");
    }
  }, [updateAddress]);

  const { translation } = useLanguageContext();

  const { userData } = useAuthContext();

  const [country, setCountry] = useState(updateAddress.country);
  const [street, setStreet] = useState(updateAddress?.street);
  const [houseName, setHousename] = useState(updateAddress?.address_1);
  const [state, setstate] = useState(updateAddress?.state);
  const [city, setCity] = useState(updateAddress?.city);
  const [firstName, setFirstName] = useState(updateAddress?.full_name);
  const [phone, setPhone] = useState(updateAddress?.phone);

  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setstate(state);
  }, []);

  useEffect(() => {
    // Set the country to the selected user's country
    setCountry(updateAddress.country);
  }, [updateAddress.country]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const requestData = {
      meta_data: [
        {
          key: "additional_addresses",
          value: {
            full_name: firstName || updateAddress?.full_name,
            last_name: "",
            company: "",
            country: country || updateAddress?.country,
            address_1: houseName || updateAddress?.address_1,
            address_2: houseName || updateAddress?.address_1,
            landmark: "" || "",
            state: state || updateAddress?.state,
            city: city || updateAddress?.city,
            pincode: "" || "",
            phone: phone || updateAddress?.phone,
            street: street || updateAddress?.street,
            id: parseInt(id?.id),
          },
        },
      ],
    };

    try {
      // Submit the review
      const response = await fetch(
        `${apiUrl}wp-json/custom/v1/customer/${
          userData && userData?.id
        }/update-address?address_id=${id?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        //  onAddressAdded();
        setLoading(false);
        setStatus(true);

        setTimeout(() => {
          setStatus(false);
        }, 1000);


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
        } catch (error) {
          console.error("Error fetching data:", error);
        }

        router.back();
      } else {
        const errorResponse = await response.json();
        console.error(
          "Failed to update address",
          response.status,
          errorResponse
        );
        setError(true);
        setLoading(false);
        setStatus(false);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      setStatus(false);
      console.error("An error occurred:", error);
    } finally {
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="none"
      style={{
        opacity: updateAddress?.length === 0 && "0.3",
        pointerEvents: updateAddress?.length === 0 && "none",
      }}
    >
      <div className="grid gap-8">
        {status && (
          <Alerts
            status="green"
            title={getTranslation(
              translation[0]?.translations,
              "You have successfully added your new address.",
              locale || "en"
            )}
          />
        )}
        {error && (
          <Alerts
            status="red"
            title={getTranslation(
              translation[0]?.translations,
              "There was an issue adding your new address. Please try again.",
              locale || "en"
            )}
          />
        )}

        <FloatingLabelInput
          value={firstName}
          type="text"
          className="input"
          label={getTranslation(
            translation[0]?.translations,
            "Full Name",
            locale || "en"
          )}
          name="firstname"
          onChange={(name, value) => setFirstName(value)}
          required
          autoComplete="none"
          alphabet
        />

        <FloatingLabelInput
          value={phone}
          type="tel"
          className="input"
          label={getTranslation(
            translation[0]?.translations,
            "Contact Number",
            locale || "en"
          )}
          name="phone"
          onChange={(name, value) => setPhone(value)}
          required
          autoComplete="none"
        />

        <FloatingLabelInput
          value={houseName}
          type="text"
          className="input"
          label={getTranslation(
            translation[0]?.translations,
            "Address",
            locale || "en"
          )}
          name="houseName"
          onChange={(name, value) => setHousename(value)}
          required
          autoComplete="none"
        />

        <FloatingLabelInput
          value={street}
          type="text"
          className="input"
          label={getTranslation(
            translation[0]?.translations,
            "Street",
            locale || "en"
          )}
          name="street"
          onChange={(name, value) => setStreet(value)}
          required
          autoComplete="none"
        />

        <FloatingLabelInput
          value={city}
          type="text"
          className="input"
          label={getTranslation(
            translation[0]?.translations,
            "City",
            locale || "en"
          )}
          name="city"
          onChange={(name, value) => setCity(value)}
          required
          autoComplete="none"
          alphaNuemricOnly
        />

        <FloatingLabelInput
          value={state}
          type="text"
          className="input"
          label={getTranslation(
            translation[0]?.translations,
            "State",
            locale || "en"
          )}
          name="state"
          onChange={(name, value) => setstate(value)}
          required
          autoComplete="none"
          alphaNuemricOnly
        />
        <div className="w-full">
          <select
            className="input w-full"
            onChange={(e) => setCountry(e.target.value)}
            value={country} // Make sure to bind value to `country`
          >
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
                <LoadingItem dot classes="bg-white size-4" />
                {getTranslation(
                  translation[0]?.translations,
                  "Update in progress...",
                  locale || "en"
                )}
              </>
            ) : (
              getTranslation(
                translation[0]?.translations,
                "Update Address",
                locale || "en"
              )
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
