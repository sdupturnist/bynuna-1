"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'nextjs-toploader/app';
import Swal from "sweetalert2";
import { useCartContext } from "../Context/cartContext";
import { useCheckoutContext } from "../Context/checkoutContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported

import {
  apiUrl,
  woocommerceKey,
  homeUrl,
  convertCurrency,
  totalPayPassword,
  totalPayMerchantKeyTest,
  siteName,
  getTranslation,
} from "../Utils/variables";
import { useSiteContext } from "../Context/siteContext";
import CryptoJS from "crypto-js";
import { useAuthContext } from "../Context/authContext";
import { useLanguageContext } from "../Context/LanguageContext";


export default function TotalPay({locale}) {
  const router = useRouter();
   

    const { translation } = useLanguageContext();

  const { activeCurrencySymbol, currencies, activeCurrency } = useSiteContext();

    const [loading, setLoading] = useState(false);

  const { userData } = useAuthContext();
  const {
    cartItems,
    discount,
    cartSubTotal,
    couponCode,
    couponCodeName,
    shippingCharge,
    guestUserData,
    guestUser,
    setGuestUserDataValidation,
    payAmount,
    haveShippingCharge,
    discountType,
    vat,
    vatAmount,
    finalDiscount,
    eligibleFreeShipping,
  } = useCartContext();





  const { billingAddress, paymentTerms, identificationTerms, validateGuestCheckoutForm, setValidateGuestCheckoutForm } =
    useCheckoutContext();

  const [orders, setOrders] = useState([]);

  const currency = currencies?.find(
    (currency) =>
      currency.slug === String(activeCurrency).toLowerCase().replace(/ /g, "-")
  );

 const notifyAddress = () =>
    toast.error(
      getTranslation(
        translation[0]?.translations,
        "Please select a billing address",
        locale || 'en'
      )
    );
  const notifyTerms = () =>
    toast.error(
      getTranslation(
        translation[0]?.translations,
        "You must accept the terms and conditions to proceed.",
        locale || 'en'
      )
    );

  const notifyIdentification = () =>
    toast.error(
      getTranslation(
        translation[0]?.translations,
        "Please check to confirm identification for collection.",
        locale || 'en'
      )
    );

  const validateGuestaddressForm = () =>
    toast.error(
      getTranslation(
        translation[0]?.translations,
        "Please fill the  billing address completely.",
        locale || 'en'
      )
    );
   
  const hasLicenceItems =
    cartItems && cartItems?.some((item) => item?.isNeedLicence === 1);

  //CREATE ORDER NUMBER BY THE RECENT ORDER
  const recentOrder = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wc/v3/orders${woocommerceKey}`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch header menus");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems = cartItems.map(({ id, image, ...rest }) => rest);

  const totalDiscount = discount || 0;

  const orderItemsDescription = cartItems
    ?.map((item) => `id:${item.id} ${item.slug}`)
    .join(", ");

  const shippingChargeFinal =
    shippingCharge?.acf?.Active_Shipping_Charge?.charge;

  useEffect(() => {
    recentOrder();
  }, []);

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
                      locale || 'en'
                    ),
                    //  text: `Do you need to confirm your order with Cash on Delivery?`,
                    html:
                      activeCurrency !== "AED"
                        ? `<p className="mb-3"><span className="font-bold block mb-1">
                           ${getTranslation(
                             translation[0]?.translations,
                             "Do you need to confirm your order?",
                             locale || 'en'
                           )}
                            </span> 
                             ${getTranslation(
                               translation[0]?.translations,
                               "The total order amount is",
                               locale || 'en'
                             )}
                             ${activeCurrencySymbol}${convertCurrency(
                            parseInt(payAmount),
                            currency?.acf?.currency_rate
                          )}, 
                         
                            ${getTranslation(
                              translation[0]?.translations,
                              "which is approximately AED",
                              locale || 'en'
                            )}
                          ${payAmount}
                           ${getTranslation(
                             translation[0]?.translations,
                             "based on the current exchange rate. Please note that the payment will be processed in AED. The exact amount will depend on the exchange rate at the time of payment, so kindly be aware of any potential fluctuations.",
                             locale || 'en'
                           )} 
                          </p>`
                        : `<p>
                         ${getTranslation(
                           translation[0]?.translations,
                           "Do you need to confirm your order?",
                           locale || 'en'
                         )} 
                        </p>`,
             icon: false,
                    showCancelButton: true,
                    confirmButtonText: getTranslation(
                      translation[0]?.translations,
                      "Yes",
                      locale || 'en'
                    ),
                    cancelButtonText: getTranslation(
                      translation[0]?.translations,
                      "Cancel",
                      locale || 'en'
                    ),
                    reverseButtons: true,
                  })
      .then(async (result) => {
        if (result.isConfirmed) {

          const orderNumber = `order-${orders?.length === 0 ? 1 : orders[0]?.id + 1}`;
          const orderAmount = payAmount.toFixed(2);
          const orderCurrency = "AED";
          const orderDescription = `order items:${orderItemsDescription}`;
          const password = totalPayPassword;

          const toMD5 = (
            orderNumber +
            orderAmount +
            orderCurrency +
            orderDescription +
            password
          ).toUpperCase();

          const md5Hash = CryptoJS.MD5(toMD5).toString();
          const sha1Hash = CryptoJS.SHA1(md5Hash).toString(CryptoJS.enc.Hex);

      

          try {
            // Step 1: Create the order ID from the server
            const response = await fetch(
              `${apiUrl}wp-json/totalpay/v1/process-payment/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  merchant_key: totalPayMerchantKeyTest,
                  password: totalPayPassword,
                  card: {
                    number: "4111111111111111",
                    expiry: "12/27",
                    cvv: "123",
                  },
                  order_number: String(orderNumber),
                  amount: orderAmount,
                  currency: "AED",
                  description: orderDescription,
                  cancel_url: `${homeUrl}${locale}/checkout/cancel`,
                  success_url: `${homeUrl}${locale}/checkout/success?payment=success&hash=${sha1Hash}&orderId=${String(orderNumber)}`,
                  expiry_url: `${homeUrl}${locale}/checkout/expiry`,
                  customer: {
                    name: billingAddress?.firstName,
                    email: userData?.email,
                  },
                  card_token: [
                    "f5d6a0ab6fcfb6487a39e2256e50fff3c95aaa97075ee5e539bb662fceff4dc1",
                  ],
                  req_token: true,
                  recurring_init: true,
                  hash: sha1Hash,
                }), // Amount in paise (1 INR = 100 paise)
              }
            );

            const data = await response.json();
            

            if (data) {
          
              typeof window !== "undefined" &&   sessionStorage.setItem(
                `${siteName}_email_data`,
                JSON.stringify([
                  {
                    discount: discount || 0,
                    cartSubTotal: cartSubTotal,
                    shippingChargeFinal: parseInt(shippingChargeFinal), // Assuming this is the actual shipping charge
                    eligibleFreeShipping: eligibleFreeShipping, // This is for checking if free shipping is eligible
                    activeCurrencySymbol: activeCurrencySymbol, // Currency symbol
                    vat: vat, // VAT percentage or value
                    vatAmount: vatAmount, // VAT amount
                    finalDiscount: finalDiscount, // The final discount after all calculations
                    currency: currency, // Currency type (e.g., USD, EUR)
                  }
                 
                ])
              );

              typeof window !== "undefined" &&  sessionStorage.setItem(
                `${siteName}_order_data`,
                JSON.stringify([
                  {
                    userData: userData,
                    transaction_id: (orders[0] && orderNumber) || "", // No transaction ID for COD
                    customer_id: userData?.id || 1,
                    payment_method: "totalpay", // Payment method for COD
                    payment_method_title: "Totalpay", // Payment method title
                    set_paid: true, // Mark as unpaid for COD
                    billing: {
                      first_name: billingAddress?.firstName || "",
                      last_name: billingAddress?.firstName || "",
                      address_1: billingAddress?.houseName || "",
                      address_2: billingAddress?.street || "",
                      street: billingAddress?.street || "",
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
                      street: billingAddress?.street || "",
                      city: billingAddress?.city || "",
                      state: billingAddress?.state || "",
                      postcode: billingAddress?.postcode || "",
                      country: billingAddress?.country || "",
                      email: userData?.email || billingAddress?.email || "",
                      phone: userData?.phone || billingAddress?.phone || "",
                    },
                    tax_lines: [
                      {
                          "id": 1200,
                          "rate_code": "VAT-1",
                          "rate_id": 2,
                          "label": "VAT",
                          "compound": false,
                          "tax_total": "0.00",
                          "shipping_tax_total": "0.00",
                          "rate_percent": 5,
                          "meta_data": []
                      }
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
                    shipping_lines: eligibleFreeShipping === false
                      ? [
                          {
                            method_id: "flat_rate",
                            method_title: "Flat Rate",
                            total: shippingCharge?.acf?.Active_Shipping_Charge?.charge,
                          },
                        ]
                      : [
                          {
                            method_id: "free_shipping",
                            method_title: "Free Shipping",
                            total: "0",
                          },
                        ],
                  }
                ])
              );

            

              typeof window !== "undefined" && 
               sessionStorage.getItem(`${siteName}_email_data`) && 
               typeof window !== "undefined" && 
                sessionStorage.getItem(`${siteName}_order_data`) && 
              router.replace(data?.redirect_url);
             
              

            
            }
          } catch (error) {
            console.error("Error during payment process: ", error);
          }
        }
      });
  };

  return (
    <div className="w-full">
      <button className="btn btn-primary !w-full" onClick={handlePayment}>
        {loading
                 ? getTranslation(
                     translation[0]?.translations,
                     "Order Processing...",
                     locale || 'en'
                   )
                 : getTranslation(
                     translation[0]?.translations,
                     "Proceed to Checkout",
                     locale || 'en'
                   )} 
      </button>
      <div className="absolute">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />
      </div>
    </div>
  );
}
