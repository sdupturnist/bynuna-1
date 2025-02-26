"use client";

import Link from "next/link";
import {
  convertCurrency,
  getTranslation,
  homeUrl,
  siteName,
} from "../Utils/variables";
import SectionHeader from "./SectionHeader";
import { useCartContext } from "../Context/cartContext";
import { useEffect } from "react";
import { useSiteContext } from "../Context/siteContext";
import { useAuthContext } from "../Context/authContext";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";

export default function AmountList({ data, forOrderDetails, tableView,  }) {

    const router = useRouter();
       const params = useParams();  
       const locale = params.locale; 

  const { activeCurrencySymbol, activeCurrency, currencies } = useSiteContext();
  const {
    cartItems,
    couponCode,
    discount,
    cartSubTotal,
    setHaveShippingCharge,
    shippingCharge,
    vat,
    setVatAmount,
    setPayAmount,
    setFinalDiscount,
    maximumCouponApplied,
    discountType,
    setEligibleFreeShipping,
    eligibleFreeShipping,
  } = useCartContext();

  const { userData } = useAuthContext();


  const { translation } = useLanguageContext();

  useEffect(() => {}, [cartItems, couponCode, discount, cartSubTotal]);

  const currency = currencies?.find(
    (currency) =>
      currency.slug === String(activeCurrency).toLowerCase().replace(/ /g, "-")
  );

  const joinDate = new Date(userData?.date_created);
  //const joinDate = new Date("2021-01-18T04:49:05");
  const today = new Date();

  // Calculate the difference in time (in milliseconds)
  const timeDifference = today - joinDate;

  // Convert time difference from milliseconds to days
  const joinDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const getcurrentShippingCharge =
    shippingCharge?.acf?.Active_Shipping_Charge?.charge;

  const shippingChargeLimit =
    shippingCharge?.acf?.Active_Shipping_Charge?.sub_total_minimum;

  //const shippingChargeLimit = 10000;

  const freeShippingDays =
    shippingCharge?.acf?.Active_Shipping_Charge?.free_shipping_days;
  const isFreeShipping = freeShippingDays > joinDays;
  const vatCharge = parseInt(vat?.rate);

  const currentShippingCharge =
    shippingChargeLimit > cartSubTotal ? getcurrentShippingCharge : 0;

  let currentDiscount = (cartSubTotal * discount) / 100;

  const isHaveShippingCharge = () => {
    const shippingCharge =
      joinDays > freeShippingDays && shippingChargeLimit > cartSubTotal
        ? parseInt(getcurrentShippingCharge)
        : 0;

    return shippingCharge;
  };

  //CHECK TAX AFTER DISCOUNT IF HAVE
  const cartItemsWithDiscountAndTax =
    cartItems &&
    cartItems.map((item) => {
      // Initialize finalPrice to 0
      let finalPrice = 0;

      // Calculate discounted price
      if (discount) {
        if (discountType === "percent") {
          if (maximumCouponApplied) {
            finalPrice = (item.price - maximumCouponApplied) * item?.quantity;
          } else {
            finalPrice = item.price * (1 - discount / 100) * item?.quantity;
          }
        } else {
          finalPrice = item.price - discount / cartItems.length;
        }
      } else {
        // If no discount, apply an even discount split across items
        finalPrice = item.price;
      }

      // Calculate tax on discounted price
      const tax = (finalPrice * vatCharge) / 100;

      // Calculate total price after discount and tax
      const totalPrice = finalPrice + tax + parseInt(isHaveShippingCharge());

      // Return item with updated properties
      return {
        ...item,
        discountedPrice: finalPrice,
        tax: tax,
        totalPrice: totalPrice,
      };
    });

  const totalPayAmount =
    cartItemsWithDiscountAndTax &&
    cartItemsWithDiscountAndTax
      .map((product) => {
        product.totalPrice = product.price * product.quantity;
        return product.totalPrice; // Return the calculated totalPrice for each item
      })
      .reduce((acc, currentValue) => acc + currentValue, 0); // Sum up all the totalPrices

  const totalTax =
    cartItemsWithDiscountAndTax &&
    cartItemsWithDiscountAndTax?.reduce(
      (sum, item) => sum + item.tax * item?.quantity,
      0
    );

  useEffect(() => {
    // const payAmount = totalPayAmount();

    const payAmount = parseInt(
      parseInt(
        discount
          ? maximumCouponApplied
            ? maximumCouponApplied
            : discountType === "percent"
            ? currentDiscount +
              totalTax +
              (eligibleFreeShipping ? 0 : parseInt(getcurrentShippingCharge))
            : cartSubTotal -
              discount +
              totalTax +
              (eligibleFreeShipping ? 0 : parseInt(getcurrentShippingCharge))
          : totalPayAmount +
              totalTax +
              (eligibleFreeShipping ? 0 : parseInt(getcurrentShippingCharge))
      )
    );

    setHaveShippingCharge(isFreeShipping);
    setVatAmount(totalTax);
    setPayAmount(payAmount);
    setEligibleFreeShipping(isFreeShipping ? true : false);
    setFinalDiscount(
      parseInt(
        maximumCouponApplied
          ? maximumCouponApplied
          : discountType === "percent"
          ? currentDiscount
          : cartItems && discount
      )
    );
  }, [cartSubTotal, currentDiscount, vatCharge, getcurrentShippingCharge]); // Dependencies to re-run when relevant data changes

  const renderAmountList = () => {
    switch (true) {
      case !forOrderDetails && !tableView:
        return (
          <ul className="amount-list">
            <li>
              <span className="label">
                {getTranslation(
                  translation[0]?.translations,
                  "Subtotal",
                  locale || 'en'
                )}
              </span>
              <span className="val">
                {activeCurrencySymbol}
                {convertCurrency(
                  parseInt(cartSubTotal),
                  currency?.acf?.currency_rate
                )}
              </span>
            </li>
            {couponCode && (
              <li>
                <span className="label">
                  {getTranslation(
                    translation[0]?.translations,
                    "Coupon discount",
                    locale || 'en'
                  )}
                </span>
                <span className="val !text-primary">
                  -{activeCurrencySymbol}
                  {convertCurrency(
                    parseInt(
                      maximumCouponApplied
                        ? maximumCouponApplied
                        : discountType === "percent"
                        ? currentDiscount
                        : cartItems && discount
                    ),
                    currency?.acf?.currency_rate
                  )}
                </span>
              </li>
            )}

            {shippingChargeLimit > cartSubTotal && (
              <li>
                <span className="label grid">
                  {getTranslation(
                    translation[0]?.translations,
                    "Delivery fee",
                    locale || 'en'
                  )}
                  {isFreeShipping && (
                    <small className="text-primary text-xs font-normal block pt-2">
                      {getTranslation(
                        translation[0]?.translations,
                        "FREE Delivery First 3 Months",
                        locale || 'en'
                      )}
                    </small>
                  )}
                </span>
                <span className="val ">
                  {activeCurrencySymbol}
                  {isFreeShipping
                    ? 0
                    : convertCurrency(
                        parseInt(currentShippingCharge),
                        currency?.acf?.currency_rate
                      )}
                </span>
              </li>
            )}
            <li>
              <span className="label grid">
                {getTranslation(translation[0]?.translations, "VAT", locale || 'en')}{" "}
                ({vatCharge}%)
              </span>
              <span className="val">
                {activeCurrencySymbol}
                {convertCurrency(
                  parseInt(totalTax),
                  currency?.acf?.currency_rate
                )}
              </span>
            </li>
            <li className="border-t border-border">
              <span className="label">
                {getTranslation(
                  translation[0]?.translations,
                  "Total",
                  locale || 'en'
                )}
              </span>

              <span className="val !text-lg font-bold !grid justify-end text-end grid-2">
                <span className="block">
                  {activeCurrencySymbol}
                  {convertCurrency(
                    parseInt(
                      discount
                        ? maximumCouponApplied
                          ? maximumCouponApplied
                          : discountType === "percent"
                          ? currentDiscount +
                            totalTax +
                            (eligibleFreeShipping
                              ? 0
                              : parseInt(getcurrentShippingCharge))
                          : cartSubTotal -
                            discount +
                            totalTax +
                            (eligibleFreeShipping
                              ? 0
                              : parseInt(getcurrentShippingCharge))
                        : totalPayAmount +
                            totalTax +
                            (eligibleFreeShipping
                              ? 0
                              : parseInt(getcurrentShippingCharge))
                    ).toFixed(2),
                    currency?.acf?.currency_rate
                  )}
                </span>
              </span>
            </li>

            {couponCode && (
              <li>
                <div className="text-xs text-primary font-normal mt-1">
                  {getTranslation(
                    translation[0]?.translations,
                    "A discount of",
                    locale || 'en'
                  )}
                  <span className="px-1">
                    {maximumCouponApplied
                      ? maximumCouponApplied < currentDiscount
                        ? activeCurrencySymbol +
                          convertCurrency(
                            maximumCouponApplied,
                            currency?.acf?.currency_rate
                          )
                        : activeCurrencySymbol + currentDiscount
                      : discountType === "percent"
                      ? `${parseInt(discount)}% OFF`
                      : `${activeCurrencySymbol}${discount?.toFixed(2)}`}
                  </span>
                  {getTranslation(
                    translation[0]?.translations,
                    "has been applied",
                    locale || 'en'
                  )}

                  {maximumCouponApplied !== 0 &&
                    discountType === "percent" &&
                    `, ${getTranslation(
                      translation[0]?.translations,
                      "with a",
                      locale || 'en'
                    )} ${discount}% ${getTranslation(
                      translation[0]?.translations,
                      "discount off the total.",
                      locale || 'en'
                    )}`}
                  {maximumCouponApplied !== 0 &&
                    `${getTranslation(
                      translation[0]?.translations,
                      "up to a maximum of",
                      locale || 'en'
                    )} ${
                      activeCurrencySymbol +
                      convertCurrency(
                        maximumCouponApplied,
                        currency?.acf?.currency_rate
                      )
                    }`}
                </div>
              </li>
            )}
          </ul>
        );
      case forOrderDetails:
        return (
          <ul className="amount-list">
            <li>
              <span className="label">
                {getTranslation(
                  translation[0]?.translations,
                  "payment ID",
                  locale || 'en'
                )}
              </span>
              <span className="val">
                {activeCurrencySymbol}
                {cartSubTotal}
              </span>
            </li>
            <li>
              <span className="label">
                {getTranslation(
                  translation[0]?.translations,
                  "Payment method",
                  locale || 'en'
                )}
              </span>
              <span className="val">
                {activeCurrencySymbol}
                {cartSubTotal}
              </span>
            </li>
            <li>
              <span className="label">
                {getTranslation(
                  translation[0]?.translations,
                  "Subtotal",
                  locale || 'en'
                )}
              </span>
              <span className="val">
                {activeCurrencySymbol}
                {cartSubTotal}
              </span>
            </li>
            {couponCode && (
              <li>
                <span className="label">
                  {getTranslation(
                    translation[0]?.translations,
                    "Coupon discount",
                    locale || 'en'
                  )}
                </span>
                <span className="val !text-primary">-{parseInt(discount)}</span>
              </li>
            )}

            <li>
              <span className="label grid">
                {getTranslation(
                  translation[0]?.translations,
                  "Delivery fee",
                  locale || 'en'
                )}
                <small className="text-primary text-xs font-normal block pt-2">
                  {getTranslation(
                    translation[0]?.translations,
                    "FREE Delivery First 3 Months",
                    locale || 'en'
                  )}
                </small>
              </span>
              <span className="val ">{currentShippingCharge}</span>
            </li>
            <li>
              <span className="label grid">
                {getTranslation(translation[0]?.translations, "VAT", locale || 'en')}{" "}
                (5%)
              </span>
              <span className="val ">
                {getTranslation(translation[0]?.translations, "AED", locale || 'en')}
              </span>
            </li>
            <li className="border-t border-border">
              <span className="label">
                {getTranslation(
                  translation[0]?.translations,
                  "Total",
                  locale || 'en'
                )}
              </span>
              <span className="val !text-lg font-bold !grid justify-end text-end grid-2">
                <span className="block">
                  {activeCurrencySymbol}
                  {cartSubTotal +
                    (shippingChargeLimit > cartSubTotal &&
                      currentShippingCharge) -
                    discount}
                </span>
              </span>
            </li>
          </ul>
        );
      case tableView:
        return (
          <ul className="amount-list">
            {data &&
              data.map((item, index) => (
                <div key={index}>
                  <div className="items-center mb-5">
                    <SectionHeader
                      spacingSm
                      titleSmall
                      title={`${
                        item.transaction_id
                          ? getTranslation(
                              translation[0]?.translations,
                              "Transaction ID: #",
                              locale || 'en'
                            ) + item.transaction_id
                          : `Order ID: #` + item?.id
                      }`}
                    />
                  </div>
                  <ul className="table-amount-list mb-2 capitalize" key={index}>
                    <li>
                      <span className="label">
                        {getTranslation(
                          translation[0]?.translations,
                          "Payment Method:",
                          locale || 'en'
                        )}
                      </span>
                      <span className="text-sm">
                        {item.payment_method_title}
                      </span>
                    </li>
                    <li>
                      <span className="label">
                        {getTranslation(
                          translation[0]?.translations,
                          "Payment Status:",
                          locale || 'en'
                        )}
                      </span>
                      <span
                        className={`${
                          item.status === "completed"
                            ? "text-green-600"
                            : "text-red-600"
                        } text-sm font-semibold`}
                      >
                        {item.status}
                      </span>
                    </li>
                    {item.refund_information === 1 && (
                      <li>
                        <span className="label">
                          {getTranslation(
                            translation[0]?.translations,
                            "Refund Status:",
                            locale || 'en'
                          )}
                        </span>
                        <span className="text-sm text-green-600">
                          {getTranslation(
                            translation[0]?.translations,
                            "Refunded",
                            locale || 'en'
                          )}
                        </span>
                      </li>
                    )}
                  </ul>

                  {/* <Invoice/> */}
                  {item?.status === "completed" && (
                    <Link
                      href={`${homeUrl}${locale}/account/transations/${item?.id}`}
                      className="btn btn-medium btn-light mt-3"
                    >
                      {getTranslation(
                        translation[0]?.translations,
                        "View",
                        locale || 'en'
                      )}
                    </Link>
                  )}
                </div>
              ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return <>{renderAmountList()}</>;
}
