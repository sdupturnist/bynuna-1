"use client";

import { useCheckoutContext } from "../Context/checkoutContext";
import { useEffect, useState } from "react";
import ModalPopup from "./ModalPopup";
import { apiUrl, getTranslation, siteName } from "../Utils/variables";
import { useCartContext } from "../Context/cartContext";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";

export default function PaymentOptionsList({ data }) {
  const {
    setPaymentMethodOption,
    setPaymentTerms,
    paymentTerms,
    setIdentificationsTerms,
    identificationTerms,
  } = useCheckoutContext();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { translation } = useLanguageContext();

  const { cartItems } = useCartContext();

  const hasLicenceItems =
    cartItems && cartItems?.some((item) => item?.isNeedLicence === "yes");

  const enabledGateways =
    data && data.filter((gateway) => gateway.enabled === true);

  const [termsContent, setTermsContent] = useState([]);

  const terms = () =>
    fetch(
      `${apiUrl}wp-json/wp/v2/pages?slug=terms-and-conditions&lang=${
        locale || "en"
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setTermsContent(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

  useEffect(() => {
    setTermsContent(terms);
  }, []);

  useEffect(() => {
    if (
      enabledGateways &&
      enabledGateways.length > 0 &&
      !selectedPaymentMethod
    ) {
      setSelectedPaymentMethod(enabledGateways[0].id);
      setPaymentMethodOption(enabledGateways[0].id);
    }
  }, [enabledGateways, selectedPaymentMethod, setPaymentMethodOption]);

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
    setPaymentMethodOption(e.target.value);
  };

  // Fixing useEffect for state updates
  useEffect(() => {
    if (hasLicenceItems === false) {
      setIdentificationsTerms(false);
    }
  }, [hasLicenceItems, setIdentificationsTerms]);

  const totalPay = [
    {
      id: "Total pay",
      title: getTranslation(
        translation[0]?.translations,
        "Credit or Debit Card (Totalpay)",
        locale || "en"
      ),
    },
  ];

  return (
    <>
      <ModalPopup
        title={getTranslation(
          translation[0]?.translations,
          "Terms and conditions",
          locale || "en"
        )}
        item={
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: (terms && termsContent[0]?.content?.rendered) || "",
            }}
          ></div>
        }
        noButton
      />
      {data &&
        [...enabledGateways, ...totalPay].map((item, index) => (
          <div key={index} className="mb-1">
            <div className="flex gap-3">
              <input
                type="radio"
                className="radio radio-success radio-sm mt-1"
                name="payment_option"
                onChange={handlePaymentMethodChange}
                value={item?.id}
                checked={selectedPaymentMethod === item?.id}
              />
              <label>
                {getTranslation(
                  translation[0]?.translations,
                  item?.title,
                  locale || "en"
                )}
              </label>
            </div>
          </div>
        ))}
      <div className="pt-5 border-t border-border my-3">
        <div className="grid gap-3">
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              className="checkbox checkbox-success checkbox-xs rounded-none"
              name="selected_address"
              checked={paymentTerms}
              onChange={(e) => {
                setPaymentTerms(!paymentTerms);
              }}
            />
            <label>
              {getTranslation(
                translation[0]?.translations,
                "I agree to the",
                locale || "en"
              )}
              <span
                className="text-primary cursor-pointer hover:opacity-60 transition-all px-1"
                onClick={(e) =>
                  document.getElementById("modal_all").showModal()
                }
              >
                {getTranslation(
                  translation[0]?.translations,
                  "terms and conditions",
                  locale || "en"
                )}
              </span>
              .
            </label>
          </div>
          {hasLicenceItems ? (
            <div className="flex gap-3 items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-success checkbox-xs rounded-none"
                checked={identificationTerms}
                onChange={(e) => {
                  setIdentificationsTerms(!identificationTerms);
                }}
              />
              <label>
                {getTranslation(
                  translation[0]?.translations,
                  "I understand that identification will be required for collection of this restricted item.",
                  locale || "en"
                )}
                <span
                  className="text-primary cursor-pointer hover:opacity-60 transition-all px-1"
                  onClick={(e) =>
                    document.getElementById("modal_all").showModal()
                  }
                >
                  {getTranslation(
                    translation[0]?.translations,
                    "terms and conditions",
                    locale || "en"
                  )}
                </span>
                .
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
