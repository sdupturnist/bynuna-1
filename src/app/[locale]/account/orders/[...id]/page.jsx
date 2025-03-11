"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import MyOrder from "@/app/[locale]/Components/MyOrder";
import SectionHeader from "@/app/[locale]/Components/SectionHeader";
import {
  apiUrl,
  convertCurrency,
  getTranslation,
  returnDays,
  siteName,
  woocommerceKey,
} from "@/app/[locale]/Utils/variables";
import Loading from "@/app/[locale]/Components/LoadingItem";
import { userId } from "@/app/[locale]/Utils/UserInfo";
import { useAuthContext } from "@/app/[locale]/Context/authContext";
import CancelOrderForm from "@/app/[locale]/Components/Forms/CancelOrderForm";
import { useSiteContext } from "@/app/[locale]/Context/siteContext";
import { useCartContext } from "@/app/[locale]/Context/cartContext";
import ReturnOrderForm from "@/app/[locale]/Components/Forms/ReturnOrderForm";
import { useLanguageContext } from "@/app/[locale]/Context/LanguageContext";
import Alerts from "@/app/[locale]/Components/Alerts";
import Button from "@/app/[locale]/Components/Button";

export default function OrderItem() {
  const { activeCurrencySymbol, currencies, activeCurrency } = useSiteContext();

  const params = useParams();
  const locale = params.locale;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelForm, setCancelForm] = useState(false);
  const { eligibleFreeShipping, vat } = useCartContext();
  const [showReturnOrder, setShowReturnOrder] = useState(false);

  const { userData } = useAuthContext();

  const { id } = useParams();
  const router = useRouter();

  const { translation } = useLanguageContext();

  // // Redirect to account page if no order is found
  useEffect(() => {
    if (error) {
      router.push("/account"); // Redirect to account page
    }
  }, [error, router]);

  useEffect(() => {
    // Only run once on mount

    fetch(
      `${apiUrl}wp-json/wc/v3/orders/${orderId}${woocommerceKey}&customer=${userId}&per_page=1`
    )
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []); // Empty dependency array to run the effect once

  // Ensure id is available before proceeding
  if (!id) {
    return <Loading spinner />;
  }

  const splitSlug = id;
  const orderId = splitSlug[1];

  const trackingMessage =
    order && order?.meta_data.filter((item) => item.key === "tracking");

  const subTotal = parseInt(
    order?.line_items?.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
  );

  const currency = currencies?.find(
    (currency) =>
      currency.slug === String(activeCurrency).toLowerCase().replace(/ /g, "-")
  );

  const rejectReason =
    order?.meta_data?.filter(
      (item) => item.key === "Return Rejected Reason"
    )[0] || null;

  const ordered = order?.date_created;

  // Get current time
  const currentTime = new Date();

  // Get the order creation time
  const orderTime = new Date(ordered);

  // Calculate the difference in milliseconds
  const timeDifference = currentTime - orderTime;

  // Convert milliseconds to hours (1 hour = 3600000 milliseconds)
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  // Check if the order was placed within the last 24 hours
  const isWithin24Hours = hoursDifference <= returnDays;

  return (
    <div>
      {loading ? (
        <div className="text-center min-h-[70vh] flex items-center justify-center">
          <Loading spinner />
        </div>
      ) : error ? (
        <Alerts title={error} status="red" />
      ) : (
        <>
          <div className="bg-bggray">
            <section className="pb-0 sm:pt-0 pt-3">
              <div className="sm:bg-transparent max-w-[999px] mx-auto grid gap-5">
                {/* {order?.status === "return-rejected" && (
                  <Alerts
                    status="red"
                    title={`${getTranslation(
                      translation[0]?.translations,
                      "We’re sorry, but your return request has been rejected",
                      locale || "en"
                    )}${
                      rejectReason
                        ? getTranslation(
                            translation[0]?.translations,
                            "Because",
                            locale || "en"
                          ) + rejectReason?.value
                        : ""
                    }
                   
                    `}
                  />
                )} */}

                {/* {order?.status === "returned" && (
                  <Alerts
                    status="green"
                    title={getTranslation(
                      translation[0]?.translations,
                      "Your order return request has been successfully submitted. We will review the details and get back to you shortly.",
                      locale || "en"
                    )}
                  />
                )}

                {order?.status === "cancelled" && (
                  <Alerts
                    status="green"
                    title="Your order cancellation request has been successfully submitted. If any amount has been debited, we will transfer it to your bank account within 7 days."
                  />
                )} */}

                <ul>
                  <MyOrder data={order} orderView single />
                </ul>

                <div>
                  <SectionHeader
                    title="Shipping address"
                    card-sm
                    spacingSm
                    titleSmall
                  />
                  <div className="card [&>*]:text-sm [&>*]:opacity-90 [&>*]:leading-relaxed">
                    <div className="grid gap-1 sm:max-w-[50%]">
                      <h4 className="secondary-font text-base font-semibold">
                        {order?.billing?.first_name} {order?.billing?.last_name}
                      </h4>
                      <p>
                        {order?.billing?.address_1}
                        {order?.billing?.address_2 && (
                          <span className="pl-1 inline-block">
                            , {order?.billing?.address_2}
                          </span>
                        )}
                      </p>
                      <p>
                        <span className="pr-1 inline-block">
                          {order?.billing?.city},
                        </span>
                        <span className="pr-1 inline-block">
                          {order?.billing?.state},
                        </span>
                        {order?.billing?.country}
                      </p>
                      <p>
                        {getTranslation(
                          translation[0]?.translations,
                          "Phone.",
                          locale || "en"
                        )}

                        <span className="pl-1 inline-block">
                          {order?.billing?.phone}
                        </span>
                      </p>
                      <p>
                        {getTranslation(
                          translation[0]?.translations,
                          "Email.",
                          locale || "en"
                        )}

                        <span className="pl-1 inline-block">
                          {order?.billing?.email}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <SectionHeader
                    title="Order Details"
                    card-sm
                    spacingMd
                    titleSmall
                  />
                  <div className="grid gap-5">
                    <ul className="amount-list">
                      <li>
                        <span className="label">
                          {getTranslation(
                            translation[0]?.translations,
                            "Order ID",
                            locale || "en"
                          )}
                        </span>
                        <span className="val">{order?.order_key}</span>
                      </li>
                      <li>
                        <span className="label">
                          {getTranslation(
                            translation[0]?.translations,
                            "Payment method",
                            locale || "en"
                          )}
                        </span>
                        <span className="val">
                          {order?.payment_method_title}
                        </span>
                      </li>
                      <li>
                        <span className="label">
                          {getTranslation(
                            translation[0]?.translations,
                            "Subtotal",
                            locale || "en"
                          )}
                        </span>

                        <span className="val">
                          {activeCurrencySymbol}
                          {convertCurrency(
                            parseInt(subTotal),
                            currency?.acf?.currency_rate
                          )}
                        </span>
                      </li>
                      <li>
                        <span className="label grid">
                          {getTranslation(
                            translation[0]?.translations,
                            "Delivery fee",
                            locale || "en"
                          )}

                          {eligibleFreeShipping && (
                            <small className="text-primary text-xs font-normal block pt-2">
                              {getTranslation(
                                translation[0]?.translations,
                                "FREE Delivery First 3 Months",
                                locale || "en"
                              )}
                            </small>
                          )}
                        </span>
                        <span className="val ">
                          {activeCurrencySymbol}
                          {eligibleFreeShipping
                            ? 0
                            : convertCurrency(
                                parseInt(order?.shipping_total),
                                currency?.acf?.currency_rate
                              )}
                        </span>
                      </li>
                      <li>
                        <span className="label grid">
                          {getTranslation(
                            translation[0]?.translations,
                            "VAT",
                            locale || "en"
                          )}
                          ({parseInt(vat?.rate)}%)
                        </span>
                        <span className="val ">
                          {activeCurrencySymbol}
                          {convertCurrency(
                            (parseInt(subTotal) * vat?.rate) / 100,
                            currency?.acf?.currency_rate
                          )}
                        </span>
                      </li>

                      <li className="border-t border-border">
                        <span className="label">
                          {getTranslation(
                            translation[0]?.translations,
                            "Total",
                            locale || "en"
                          )}
                        </span>
                        <span className="val !text-lg font-bold !grid justify-end text-end grid-2">
                          <span className="block">
                            {activeCurrencySymbol}
                            {convertCurrency(
                              parseInt(order?.total),
                              currency?.acf?.currency_rate
                            )}
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                {trackingMessage.length > 0 && (
                  <div className="card-rounded-none-small w-full bg-white py-4 px-3">
                    <SectionHeader
                      title="Track order"
                      card
                      spacingSm
                      titleSmall
                    />
                    <div className="grid gap-5 order-tracking">
                      {trackingMessage[0]?.value}
                    </div>
                  </div>
                )}

                <div>
                  {isWithin24Hours &&
                    !showReturnOrder &&
                    (order?.status === "completed" ||
                      order?.status === "order-delivered") && (
                      <button
                        className="btn btn-primary"
                        onTouchStart={(e) => setShowReturnOrder(!showReturnOrder)}
                        onClick={(e) => setShowReturnOrder(!showReturnOrder)}
                      >
                        {getTranslation(
                          translation[0]?.translations,
                          "Return order",
                          locale || "en"
                        )}
                      </button>
                    )}

                  {(order?.status === "completed" ||
                    order?.status === "order-delivered")  &&
                    showReturnOrder && (
                      <ReturnOrderForm
                        userInfo={userData && userData}
                        data={order && order}
                      />
                    )}
                  {order?.status !== "completed" && order?.status !== "order-delivered" && (
                    <>
                      {!cancelForm && (
                        <Button
                          classes="btn-mobile-full"
                          label="Cancel order"
                          action={() => setCancelForm(!cancelForm)}
                        />
                      )}

                      {cancelForm && (
                        <CancelOrderForm
                          data={order}
                          userInfo={userData}
                          orderedDate={order && order?.date_completed}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
