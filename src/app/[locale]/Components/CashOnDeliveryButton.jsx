"use client"; // This is necessary to enable React in this file

import React, { useState, useLayoutEffect } from "react";
import Swal from "sweetalert2";
import { useCartContext } from "../Context/cartContext";
import { useCheckoutContext } from "../Context/checkoutContext";
import { sendMail } from "../Utils/Mail";
import { useLanguageContext } from "../Context/LanguageContext";
import Cookies from "js-cookie";
import { useJwt } from "../Context/jwtContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported
import {
  apiUrl,
  woocommerceKey,
  siteLogo,
  homeUrl,
  siteEmail,
  siteName,
  convertCurrency,
  getTranslation,
} from "../Utils/variables";
import { OrderPlacedEmailTemplate } from "../Utils/MailTemplates";
import { useSiteContext } from "../Context/siteContext";
import { use } from "react";
import { useParams, useRouter } from "next/navigation";
import { userEmail } from "../Utils/UserInfo";

export default function CashOnDeliveryPayment({ userData }) {
  const params = useParams();
  const locale = params.locale;

  const { activeCurrencySymbol, currencies, activeCurrency, savedAddress } =
    useSiteContext();

  const {
    cartItems,
    discount,
    cartSubTotal,
    setCartItems,
    setCartSubTotal,
    setCartTotal,
    couponCode,
    couponCodeName,
    setCouponCode,
    shippingCharge,
    setDiscount,
    guestUserData,
    guestUser,
    setGuestUserDataValidation,
    setGuestUser,
    payAmount,
    haveShippingCharge,
    discountType,
    vat,
    vatAmount,
    finalDiscount,
    eligibleFreeShipping,
  } = useCartContext();

  const {
    validateGuestCheckoutForm,
    billingAddress,
    validateAddress,
    setValidateAddress,
    setUpdatePaymentStatus,
    validateTerms,
    setValidateTerms,
    paymentTerms,
    setPaymentTerms,
    setBillingAddress,
    identificationTerms,
    setIdentificationsTerms,
    setValidateGuestCheckoutForm,
    setOrderPlaceLoading,
  } = useCheckoutContext();

  const { token } = useJwt();

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  //const { locale } = router;

  const { translation } = useLanguageContext();

  const currency = currencies?.find(
    (currency) =>
      currency.slug === String(activeCurrency).toLowerCase().replace(/ /g, "-")
  );

  const filteredItems = cartItems.map(({ id, image, ...rest }) => rest);

  const totalDiscount = discount || 0;

  useLayoutEffect(() => {
    setBillingAddress("");
    setValidateTerms(false);
  }, []);

  const notifyAddress = () =>
    toast.error(
      getTranslation(
        translation[0]?.translations,
        "Please select a billing address",
        locale || "en"
      )
    );
  const notifyTerms = () =>
    toast.error(
      getTranslation(
        translation[0]?.translations,
        "You must accept the terms and conditions to proceed.",
        locale || "en"
      )
    );

  const notifyIdentification = () =>
    toast.error(
      getTranslation(
        translation[0]?.translations,
        "Please check to confirm identification for collection.",
        locale || "en"
      )
    );

  const validateGuestaddressForm = () =>
    toast.error(
      getTranslation(
        translation[0]?.translations,
        "Please fill the  billing address completely.",
        locale || "en"
      )
    );

  const hasLicenceItems =
    cartItems && cartItems?.some((item) => item?.isNeedLicence === 1);

  // Handle the payment and order creation logic
  const handlePayment = async () => {
    if (guestUser) {
      if (!validateGuestCheckoutForm) {
        validateGuestaddressForm();
        return;
      }

      setValidateGuestCheckoutForm(true);
    } else {
      if (
        billingAddress === null ||
        billingAddress === undefined ||
        billingAddress === ""
      ) {
        notifyAddress();
        return;
      }
    }

    if (paymentTerms === false) {
      notifyTerms();
      return;
    }

    if (hasLicenceItems && identificationTerms === false) {
      notifyIdentification();
      return;
    }

    // SweetAlert2 confirmation dialog
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-light",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: getTranslation(
          translation[0]?.translations,
          "Are you sure?",
          locale || "en"
        ),
        //  text: `Do you need to confirm your order with Cash on Delivery?`,
        html:
          activeCurrency !== "AED"
            ? `<p className="mb-3"><span className="font-bold block mb-1">
               ${getTranslation(
                 translation[0]?.translations,
                 "Do you need to confirm your order with Cash on Delivery?.",
                 locale || "en"
               )}
                </span> 
                 ${getTranslation(
                   translation[0]?.translations,
                   "The total order amount is",
                   locale || "en"
                 )}
                 ${activeCurrencySymbol}${convertCurrency(
                parseInt(payAmount),
                currency?.acf?.currency_rate
              )}, 
             
                ${getTranslation(
                  translation[0]?.translations,
                  "which is approximately AED",
                  locale || "en"
                )}
              ${payAmount}
               ${getTranslation(
                 translation[0]?.translations,
                 "based on the current exchange rate. Please note that the payment will be processed in AED. The exact amount will depend on the exchange rate at the time of payment, so kindly be aware of any potential fluctuations.",
                 locale || "en"
               )} 
              </p>`
            : `<p>
             ${getTranslation(
               translation[0]?.translations,
               "Do you need to confirm your order with Cash on Delivery?",
               locale || "en"
             )} 
            </p>`,
        icon: false,
        showCancelButton: true,
        confirmButtonText: getTranslation(
          translation[0]?.translations,
          "Yes",
          locale || "en"
        ),
        cancelButtonText: getTranslation(
          translation[0]?.translations,
          "Cancel",
          locale || "en"
        ),
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);

          setOrderPlaceLoading(true);

          try {
            // Prepare the order information for WooCommerce API
            const orderInfo = {
              transaction_id: "", // No transaction ID for COD
              customer_id: userData?.id || 1,
              payment_method: "cash_on_delivery", // Payment method for COD
              payment_method_title: "Cash on Delivery", // Payment method title
              set_paid: false, // Mark as unpaid for COD
              billing: {
                first_name: billingAddress?.firstName || "",
                last_name: billingAddress?.firstName || "",
                address_1: billingAddress?.houseName || "",
                address_2: billingAddress?.street || "",
                city: billingAddress?.city || "",
                state: billingAddress?.state || "",
                postcode: billingAddress?.postcode || "",
                country: billingAddress?.country || "",
                email: userData?.email || billingAddress?.email || "",
                phone: userData?.phone || billingAddress?.phone || "",
              },
              shipping: {
                first_name: billingAddress?.firstName || "",
                last_name: billingAddress?.firstName || "",
                address_1: billingAddress?.houseName || "",
                address_2: billingAddress?.street || "",
                city: billingAddress?.city || "",
                state: billingAddress?.state || "",
                postcode: billingAddress?.postcode || "",
                country: billingAddress?.country || "",
                email: userData?.email || billingAddress?.email || "",
                phone: userData?.phone || billingAddress?.phone || "",
              },
              tax_lines: [
                {
                  id: 1200,
                  rate_code: "VAT-1",
                  rate_id: 2,
                  label: "VAT",
                  compound: false,
                  tax_total: "0.00",
                  shipping_tax_total: "0.00",
                  rate_percent: 5,
                  meta_data: [],
                },
              ],
              line_items: filteredItems || [],
              coupon_lines:
                (couponCode && [
                  {
                    code: couponCodeName,
                    amount: finalDiscount,
                    discount_type: discountType,
                  },
                ]) ||
                [],
              shipping_lines:
                eligibleFreeShipping === false
                  ? [
                      {
                        method_id: "flat_rate",
                        method_title: "Flat Rate",
                        total:
                          shippingCharge?.acf?.Active_Shipping_Charge?.charge,
                      },
                    ]
                  : [
                      {
                        method_id: "free_shipping",
                        method_title: "Free Shipping",
                        total: "0",
                      },
                    ],
            };

            // Step 2: Send the order information to WooCommerce API
            const response = await fetch(
              `${apiUrl}wp-json/wc/v3/orders${woocommerceKey}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderInfo),
              }
            );

            if (response.ok) {

              setCartItems([]);
              setCartSubTotal(0);
              setCartTotal(0);
              setCouponCode(false);
              setDiscount(0);
              setValidateTerms(false);
              setValidateAddress(false);
              setPaymentTerms(false);
              setLoading(false);
              typeof window !== "undefined" &&
                localStorage.removeItem(`${siteName}_cart`);
              Cookies.set(`${siteName}_checkout_success`, "true", {
                expires: 1 / 1440,
              });

              setOrderPlaceLoading(false);
              
              router.push(
                `${homeUrl}${locale}/checkout/success_order?user_type=${
                  userEmail === undefined ? "guest" : "account"
                }`
              );


              //   // Send email notification to the user
              await sendMail({
                sendTo: userData?.email || billingAddress?.email,
                subject: "You Have Successfully Ordered",
                name:
                  billingAddress?.firstName ||
                  guestUserData?.address?.full_name,
                message: OrderPlacedEmailTemplate(
                  siteLogo,
                  billingAddress,
                  cartItems,
                  "COD",
                  "Cash on Delivery",
                  String(billingAddress?.email || userData?.email),
                  "",
                  discount || 0,
                  cartSubTotal,
                  shippingCharge?.acf?.Active_Shipping_Charge?.charge,
                  eligibleFreeShipping,
                  activeCurrencySymbol,
                  vat?.rate,
                  vatAmount,
                  finalDiscount,
                  currency,
                  "Pending"
                ),
              });

              // Send email notification to the admin
              await sendMail({
                sendTo: siteEmail,
                subject: "You Have Received a New Order",
                name: "Admin",
                message: OrderPlacedEmailTemplate(
                  siteLogo,
                  billingAddress,
                  cartItems,
                  "COD",
                  "Cash on Delivery",
                  String(billingAddress?.email || userData?.email),
                  "",
                  discount || 0,
                  cartSubTotal,
                  shippingCharge?.acf?.Active_Shipping_Charge?.charge,
                  eligibleFreeShipping,
                  activeCurrencySymbol,
                  vat?.rate,
                  vatAmount,
                  finalDiscount,
                  currency,
                  "Pending"
                ),
              });

              
            } else {
              setOrderPlaceLoading(false);
              throw new Error("Failed to create order in WooCommerce");
            }
          } catch (error) {
            console.error("Error during order processing: ", error);
            setLoading(false);
            setUpdatePaymentStatus("failed");
            setValidateTerms(false);
            setValidateAddress(false);
            setPaymentTerms(false);
            setLoading(false);
            router.push(`${homeUrl}${locale}/checkout/failed`);
          }
        }
      });
  };

  return (
    <>
      {savedAddress && (
        <button
          disabled={loading}
          onClick={handlePayment}
          className="btn btn-primary"
        >
          {loading
            ? getTranslation(
                translation[0]?.translations,
                "Order Processing...",
                locale || "en"
              )
            : getTranslation(
                translation[0]?.translations,
                "Proceed to Checkout",
                locale || "en"
              )}
        </button>
      )}
      <div className="absolute">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />
      </div>
    </>
  );
}
