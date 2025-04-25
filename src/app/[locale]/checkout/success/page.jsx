"use client";

import React, { useState, useEffect, useRef, Suspense, use } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useCartContext } from "../../Context/cartContext";

import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported
import CryptoJS from "crypto-js";
import {
  apiUrl,
  woocommerceKey,
  siteLogo,
  homeUrl,
  siteEmail,
  siteName,
  totalPayPassword,
  totalPayMerchantKeyTest,
} from "../../Utils/variables";
import { OrderPlacedEmailTemplate } from "../../Utils/MailTemplates";
import Alerts from "../../Components/Alerts";
import { useCheckoutContext } from "../../Context/checkoutContext";
import { useJwt } from "../../Context/jwtContext";
import { sendMail } from "../../Utils/Mail";
import { useRouter } from "next/navigation";
import { userEmail } from "../../Utils/UserInfo";


// Define a loading state to handle the suspense boundary

const SuccessPageContent = () => {
  const router = useRouter();

  const params = useParams();
  const locale = params.locale;

  const paymentHandled = useRef(false); // Ref to track payment handling

  const {
    cartItems,
    setCartItems,
    setCartSubTotal,
    setCartTotal,
    setCouponCode,
    setDiscount,
    setGuestUser,
    payAmount
  } = useCartContext();

  const { guestUser } = useCartContext();





  const {
    setValidateAddress,
    setUpdatePaymentStatus,
    setValidateTerms,
    setPaymentTerms,
    setGuestCheckoutformData
  } = useCheckoutContext();

  const { token } = useJwt();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [emailData, setEmailData] = useState(null);

  const searchParams = useSearchParams();
  const orderId = typeof window !== "undefined" && searchParams.get("orderId");

  useEffect(() => {
    const storedOrderData =
      typeof window !== "undefined" &&
      sessionStorage.getItem(`${siteName}_order_data`);
    const storedEmailData =
      typeof window !== "undefined" &&
      sessionStorage.getItem(`${siteName}_email_data`);
    if (storedOrderData) setOrderData(JSON.parse(storedOrderData));
    if (storedEmailData) setEmailData(JSON.parse(storedEmailData));
  }, []);

  const handlePayment = async (orderInfo) => {
    const password = totalPayPassword;
    const to_md5 = orderId + password;
    const hash = CryptoJS.SHA1(CryptoJS.MD5(to_md5.toUpperCase()).toString());
    const hashResult = CryptoJS.enc.Hex.stringify(hash);

    try {
      const response = await fetch(
        `${apiUrl}wp-json/totalpay/v1/payment-status/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            merchant_key: totalPayMerchantKeyTest,
            hash: hashResult && hashResult,
            order_id: orderId,
          }),
        }
      );

      const data = await response.json();

      if (data?.status === "settled") {
        try {
          setLoading(true);

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
            // Send email notification to the user
            await sendMail({
              sendTo: (orderData && orderData[0]?.billing?.email) || "",
              subject: "You Have Successfully Ordered",
              name:
                ((await orderData) && orderData[0]?.billing?.firstName) || "",
              message: OrderPlacedEmailTemplate(
                siteLogo,
                orderData && orderData[0]?.billing,
                cartItems,
                "Totalpay",
                "Totalpay",
                String(orderData && orderData[0]?.billing?.email),
                "",
                emailData[0]?.finalDiscount || 0,
                emailData[0]?.cartSubTotal,
                emailData[0]?.shippingChargeFinal,
                emailData[0]?.eligibleFreeShipping,
                emailData[0]?.currency?.acf?.symbol,
                emailData[0]?.vat?.rate,
                emailData[0]?.vatAmount,
                emailData[0]?.finalDiscount,
                emailData[0]?.activeCurrencySymbol,
                "Processing",
                emailData[0]?.payAmount
              ),
            });

            // Send email notification to the admin
            await sendMail({
              sendTo: siteEmail,
              subject: "You Have Received a New Order",
              name: "Admin",
              message: OrderPlacedEmailTemplate(
                siteLogo,
                orderData && orderData[0]?.billing,
                cartItems,
                "Totalpay",
                "Totalpay",
                String(orderData && orderData[0]?.billing?.email),
                "",
                emailData[0]?.finalDiscount || 0,
                emailData[0]?.cartSubTotal,
                emailData[0]?.shippingChargeFinal,
                emailData[0]?.eligibleFreeShipping,
                emailData[0]?.currency?.acf?.symbol,
                emailData[0]?.vat?.rate,
                emailData[0]?.vatAmount,
                emailData[0]?.finalDiscount,
                emailData[0]?.activeCurrencySymbol,
                "Processing",
                emailData[0]?.payAmount
              ),
            });

            // Clear cart data
            setCartItems([]);
            setCartSubTotal(0);
            setCartTotal(0);
            setCouponCode(false);
            setDiscount(0);
            setValidateTerms(false);
            setValidateAddress(false);
            setPaymentTerms(false);
            setGuestUser(false);
            typeof window !== "undefined" && localStorage.removeItem(`${siteName}_guestuser`)


              //NEW
              setGuestCheckoutformData({
                country: "United Arab Emirates",
                firstName: "",
                phone: "",
                email: "",
                houseName: "",
                street: "",
                city: "",
                state: "",
              });


            router.push(
              `${homeUrl}${locale}/checkout/success_order?user_type=${
                userEmail === undefined ? "guest" : "account"
              }`
            );
          } else {
            throw new Error("Failed to create order in WooCommerce");
          }
        } catch (error) {
          console.error("Error during order processing: ", error);
          setLoading(false); // Stop loading
          setUpdatePaymentStatus("failed");
          setValidateTerms(false);
          setValidateAddress(false);
          setPaymentTerms(false);
        }
      }
    } catch (error) {
      router.push(`${homeUrl}${locale}/checkout/failed`);
    }
  };

  useEffect(() => {
    if (paymentHandled.current) return; // Avoid processing payment more than once

    if (orderId && orderData) {
      handlePayment(orderData[0]); // Process payment
      paymentHandled.current = true; // Mark payment as handled
    }
  }, [orderId, orderData]);

  return (
    <Alerts
      loading={loading}
      noLogo
      title="Don't Refresh the Page"
      large
      noPageUrl
      desc={`Your order is being processed. This may take a few minutes. Please don't refresh the page or go back while we complete it.`}
    />
  );
};

export default function SuccessPage({ params }) {
  const resolvedParams = use(params); // Unwrap the params Promise

  // Now you can access the `locale` property
  const { locale } = resolvedParams;

  return <SuccessPageContent locale={locale} />;
}

// import React, { useState, useLayoutEffect, useEffect, useRef, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import { useRouter } from 'nextjs-toploader/app';
// import { useCartContext } from "../Context/cartContext";
// import { useCheckoutContext } from "../Context/checkoutContext";
// import Alerts from "../Components/Alerts";
// import { useJwt } from "../Context/jwtContext";
// import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported
// import CryptoJS from "crypto-js";
// import {
//   apiUrl,
//   woocommerceKey,
//   siteLogo,
//   homeUrl,
//   siteEmail,
//   siteName,
//   totalPayPassword,
//   totalPayMerchantKeyTest,
// } from "../Utils/variables";
// import { sendMail } from "../Utils/Mail";
// import { OrderPlacedEmailTemplate } from "../Utils/MailTemplates";
// import LoadingItem from "../Components/LoadingItem";

// // Define a loading state to handle the suspense boundary
// const LoadingFallback = () => <LoadingItem spinner/>;

// const SuccessPageContent = () => {
//   const [orderProcessed, setOrderProcessed] = useState(false);
//   const paymentHandled = useRef(false); // Ref to track payment handling

//   const {
//     cartItems,
//     setCartItems,
//     setCartSubTotal,
//     setCartTotal,
//     setCouponCode,
//     setDiscount,
//     setGuestUser,
//   } = useCartContext();

//   const {
//     setValidateAddress,
//     setUpdatePaymentStatus,
//     setValidateTerms,
//     setPaymentTerms,
//   } = useCheckoutContext();

//   const { token } = useJwt();
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("orderId");

//   const orderData =
//     typeof window !== "undefined" &&
//     sessionStorage.getItem(`${siteName}_order_data`)
//       ? JSON.parse(sessionStorage.getItem(`${siteName}_order_data`))
//       : null;

//   const emailData =
//     typeof window !== "undefined" &&
//     sessionStorage.getItem(`${siteName}_email_data`)
//       ? JSON.parse(sessionStorage.getItem(`${siteName}_email_data`))
//       : null;

//   const handlePayment = async (orderInfo) => {
//     const password = totalPayPassword;
//     const to_md5 = orderId + password;
//     const hash = CryptoJS.SHA1(CryptoJS.MD5(to_md5.toUpperCase()).toString());
//     const hashResult = CryptoJS.enc.Hex.stringify(hash);

//     try {
//       const response = await fetch(
//         `${apiUrl}wp-json/totalpay/v1/payment-status/`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             merchant_key: totalPayMerchantKeyTest,
//             hash: hashResult && hashResult,
//             order_id: orderId,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (data?.status === "settled") {
//         try {
//           setLoading(true);

//           const response = await fetch(
//             `${apiUrl}wp-json/wc/v3/orders${woocommerceKey}`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify(orderInfo),
//             }
//           );

//           if (response.ok) {
//             // Send email notification to the user
//             await sendMail({
//               sendTo: (orderData && orderData[0]?.billing?.email) || "",
//               subject: "You Have Successfully Ordered",
//               name:
//                 ((await orderData) && orderData[0]?.billing?.firstName) || "",
//               message: OrderPlacedEmailTemplate(
//                 siteLogo,
//                 orderData && orderData[0]?.billing,
//                 cartItems,
//                 "Totalpay",
//                 "Totalpay",
//                 String(orderData && orderData[0]?.billing?.email),
//                 "",
//                 emailData[0]?.finalDiscount || 0,
//                 emailData[0]?.cartSubTotal,
//                 emailData[0]?.shippingChargeFinal,
//                 emailData[0]?.eligibleFreeShipping,
//                 emailData[0]?.currency?.acf?.symbol,
//                 emailData[0]?.vat?.rate,
//                 emailData[0]?.vatAmount,
//                 emailData[0]?.finalDiscount,
//                 emailData[0]?.activeCurrencySymbol,
//                 "Processing"
//               ),
//             });

//             // Send email notification to the admin
//             await sendMail({
//               sendTo: siteEmail,
//               subject: "You Have Received a New Order",
//               name: "Admin",
//               message: OrderPlacedEmailTemplate(
//                 siteLogo,
//                 orderData && orderData[0]?.billing,
//                 cartItems,
//                 "Totalpay",
//                 "Totalpay",
//                 String(orderData && orderData[0]?.billing?.email),
//                 "",
//                 emailData[0]?.finalDiscount || 0,
//                 emailData[0]?.cartSubTotal,
//                 emailData[0]?.shippingChargeFinal,
//                 emailData[0]?.eligibleFreeShipping,
//                 emailData[0]?.currency?.acf?.symbol,
//                 emailData[0]?.vat?.rate,
//                 emailData[0]?.vatAmount,
//                 emailData[0]?.finalDiscount,
//                 emailData[0]?.activeCurrencySymbol,
//                 "Processing"
//               ),
//             });

//             // Clear cart data
//             setCartItems([]);
//             setCartSubTotal(0);
//             setCartTotal(0);
//             setCouponCode(false);
//             setDiscount(0);
//             setValidateTerms(false);
//             setValidateAddress(false);
//             setPaymentTerms(false);
//             setGuestUser(false);

//             router.push(`${homeUrl}checkout/success_order`);
//           } else {
//             throw new Error("Failed to create order in WooCommerce");
//           }
//         } catch (error) {
//           console.error("Error during order processing: ", error);
//           setLoading(false); // Stop loading
//           setUpdatePaymentStatus("failed");
//           setValidateTerms(false);
//           setValidateAddress(false);
//           setPaymentTerms(false);
//         }
//       }
//     } catch (error) {
//       router.push(`${homeUrl}checkout/failed`);
//     }
//   };

//   useEffect(() => {
//     if (paymentHandled.current) return; // Avoid processing payment more than once

//     if (orderId && orderData) {
//       handlePayment(orderData[0]); // Process payment
//       paymentHandled.current = true; // Mark payment as handled
//     }
//   }, [orderId, orderData]);

//   return (
//     <Alerts
//       loading={loading}
//       noLogo
//       title="Don't Refresh the Page"
//       large
//       noPageUrl
//       desc={`Your order is being processed. This may take a few minutes. Please don't refresh the page or go back while we complete it.`}
//     />
//   );
// };

// export default function SuccessPage() {
//   return (
//     <Suspense fallback={<LoadingFallback />}>
//       <SuccessPageContent />
//     </Suspense>
//   );
// }
