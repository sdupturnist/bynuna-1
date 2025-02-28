"use client";

import { useState, useEffect } from "react";
import Alerts from "./Alerts";
import { useCartContext } from "../Context/cartContext";
import {
  apiUrl,
  getTranslation,
  siteName,
  woocommerceKey,
} from "../Utils/variables";
import { useAuthContext } from "../Context/authContext";
import { useJwt } from "../Context/jwtContext";
import { useSiteContext } from "../Context/siteContext";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";

export default function CouponCode({}) {

    const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 

  const { translation } = useLanguageContext();


  const { userData } = useAuthContext();
  const {
    setCouponCode,
    setDiscount,
    cartSubTotal,
    setCouponCodeName,
    setMaximumCouponApplied,
    setCouponData,
    discount,
    discountType,
    setDiscountType,
    cartItems,
    setRefundable,
  } = useCartContext();

  const { currencies } = useSiteContext();

  const { token } = useJwt();

  const [allCouponData, setAllCouponData] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [clicked, setCliked] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCouponsData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wc/v3/coupons${woocommerceKey}&status=publish`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setAllCouponData(data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setMessage(
        getTranslation(
          translation[0]?.translations,
          "Failed to fetch coupons. Please try again.",
          locale || 'en'
        )
      );
    }
  };

  useEffect(() => {
    fetchCouponsData();
  }, [token]); // Fetch coupons data only when the token changes

  const checkCouponCode = (data, couponCode, cartSubTotal) => {
    setIsLoading(true);

    const couponData = data.find(
      (item) => item.code === couponCode.toLowerCase()
    );

    const hasApplicableProducts = cartItems?.some((item) =>
      couponData?.product_ids?.includes(item.id)
    );

    const hasNotApplicableProducts = cartItems?.some((item) =>
      couponData?.excluded_product_ids?.includes(item.id)
    );

    const filteredProducts = cartItems?.filter((product) =>
      couponData?.excluded_product_ids?.includes(product.id)
    );

    const filteredArray = couponData?.meta_data?.filter(
      (item) => item.key === "maximum_amount_field"
    );

    const filteredForRefundable = couponData?.meta_data?.filter(
      (item) => item.key === "refundable_field"
    );

    const isEmailAllowed = couponData?.email_restrictions?.includes(
      userData?.email
    );

    if (!couponData) {
      setMessage(
        getTranslation(
          translation[0]?.translations,
          "This coupon is invalid.",
          locale || 'en'
        )
      );
      setCouponCode(false);
      setDiscount(0);
      setDiscountType("");
      setIsValid(false);
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    const {
      amount,
      minimum_amount,
      date_expires,
      usage_limit_per_user,
      used_by,
    } = couponData;

    // Check if the coupon has expired
    const currentDate = new Date();
    const couponExpirationDate = new Date(date_expires);
    if (couponExpirationDate < currentDate) {
      setMessage(
        getTranslation(
          translation[0]?.translations,
          "This coupon has expired.",
          locale || 'en'
        )
      );
      setCouponCode(false);
      setDiscount(0);
      setDiscountType("");
      setIsValid(false);
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    // Check if the user has already used the coupon or exceeded the usage limit
    const userUsageCount = used_by.filter(
      (id) => id === String(userData?.id)
    ).length;
    const isExceededLimit = userUsageCount >= usage_limit_per_user;

    if (usage_limit_per_user && isExceededLimit) {
      setMessage(
        getTranslation(
          translation[0]?.translations,
          "This coupon has reached its usage limit for your account.",
          locale || 'en'
        )
      );
      setCouponCode(false);
      setDiscount(0);
      setDiscountType("");
      setIsValid(false);
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    // Check if cart subtotal meets minimum amount
    if (cartSubTotal < minimum_amount) {
      setMessage(
        `${getTranslation(
          translation[0]?.translations,
          "The minimum cart total of",
          locale || 'en'
        )}${currencies}${minimum_amount}${getTranslation(
          translation[0]?.translations,
          "has not been met to apply the coupon.",
          locale || 'en'
        )}`
      );
      setCouponCode(false);
      setDiscount(0);
      setDiscountType("");
      setIsValid(false);
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    // Check if cart items is applicable for redeem the coupon

    if (couponData?.product_ids?.length !== 0 && !hasApplicableProducts) {
      setMessage(
        getTranslation(
          translation[0]?.translations,
          "This coupon is not applicable for your cart items.",
          locale || 'en'
        )
      );
      setCouponCode(false);
      setDiscount(0);
      setDiscountType("");
      setIsValid(false);
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    // Check if cart items is not applicable for redeem the coupon

    if (hasNotApplicableProducts) {
      setMessage(
        `${getTranslation(
          translation[0]?.translations,
          `This coupon is not applicable for the following products:`,
          locale || 'en'
        )} :
        ${filteredProducts.map((item) => item.name).join(", ")}`
      );
      setCouponCode(false);
      setDiscount(0);
      setDiscountType("");
      setIsValid(false);
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    if (couponData?.email_restrictions?.length !== 0 && !isEmailAllowed) {
      setMessage(
        getTranslation(
          translation[0]?.translations,
          "Sorry, this coupon is not valid for your email. Please log in to your account and recheck.",
          locale || 'en'
        )
      );
      setCouponCode(false);
      setDiscount(0);
      setDiscountType("");
      setIsValid(false);
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    // Apply the coupon
    setMessage(
      getTranslation(
        translation[0]?.translations,
        "Coupon code applied successfully!",
        locale || 'en'
      )
    );
    setCouponCode(true);
    setCouponCodeName(couponData?.code);
    setDiscount(parseInt(amount));
    setMaximumCouponApplied(parseInt(filteredArray[0]?.value || 0));
    setRefundable(filteredForRefundable[0]?.value);
    setDiscountType(couponData?.discount_type);
    setCouponData(data);
    setIsValid(true);
    setShowAlert(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="coupon-code">
      <div className="join input-section w-full">
        <input
          required
          type="text"
          placeholder={getTranslation(
            translation[0]?.translations,
            "Have coupon code?",
            locale || 'en'
          )}
          className="input w-full"
          onChange={(e) => {
            setCoupon(e.target.value), setCliked(true);
          }}
        />
        {clicked && (
          <button
            onClick={() => checkCouponCode(allCouponData, coupon, cartSubTotal)}
            className="btn btn-primary"
          >
            {getTranslation(translation[0]?.translations, "Apply", locale || 'en')}
            {isLoading && <Loading />}
          </button>
        )}
      </div>

      {isValid !== null && showAlert && (
        <span
          className={`text-sm block my-2 ${
            isValid ? "text-green-600" : "text-red-500"
          }`}
        >
          <Alerts status={isValid ? "green" : "red"} title={message} />
        </span>
      )}
    </div>
  );
}
