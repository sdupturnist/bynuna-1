"use client";

import { useState, useEffect } from "react";
import Alerts from "./Alerts";
import Images from "./Images";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  currency,
  formatDate,
  formatDateStringWithTime,
  getTranslation,
  siteName,
  translateStatusToArabic,
} from "../Utils/variables";
import Skelton from "./Skelton";
import { useLanguageContext } from "../Context/LanguageContext";

export default function MyOrder({ data, orderView, userInfo, single }) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const pathname = usePathname();

  const { translation } = useLanguageContext();

  // Define the status to color mapping
  const statusColorMap = {
    pending_payment: "text-orange-500",
    on_hold: "text-yellow-500",
    processing: "text-yellow",
    completed: "text-green-500",
    failed: "text-red-500",
    canceled: "text-gray-500",
    refunded: "text-blue-500",
    confirmed: "text-green-500",
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  const returnedItems = data?.meta_data.filter(
    (item) => item.key === "returned" && item.value === "yes"
  );

  //ORDER STATUS

  const getOrderStatus = (status, locale) => {
    switch (status) {
      case "pending":
        return getTranslation(
          translation[0]?.translations,
          "Pending",
          locale || "en"
        );
      case "processing":
        return getTranslation(
          translation[0]?.translations,
          "Processing",
          locale || "en"
        );
      case "order-confirmed":
        return getTranslation(
          translation[0]?.translations,
          "Confirmed",
          locale || "en"
        );
      case "order-shipped":
        return getTranslation(
          translation[0]?.translations,
          "Shipped",
          locale || "en"
        );
      case "completed":
        return getTranslation(
          translation[0]?.translations,
          "Completed",
          locale || "en"
        );
      case "order-delivered":
        return getTranslation(
          translation[0]?.translations,
          "Delivered",
          locale || "en"
        );
      default:
        return getTranslation(
          translation[0]?.translations,
          "Unknown Status",
          locale || "en"
        ); // Optional, if the status doesn't match any case
    }
  };

  const cancellationReason = data?.meta_data.find(
    (item) => item.key === "Cancellation Reason"
  );
  const returnRejectionReason = data?.meta_data.find(
    (item) => item.key === "Return Rejected Reason"
  );

  return (
    <>
      {loading ? (
        // Skeleton Loader
        <Skelton productleftRightCard />
      ) : (
        <li
          className={`${
            orderView ? "mb-0" : "mb-3"
          } border border-border bg-white`}
          data-id={data?.id}
        >
          {single ? (
            <>
              <div className="lg:flex items-start justify-between w-full gap-3">
                <div className="flex gap-[10px] justify-between w-full">
                  <div className="grid gap-[10px] py-2">
                    {data &&
                      data?.line_items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex sm:gap-4 gap-2 items-center"
                        >
                          <div className="flex items-center sm:h-[60px] sm:w-[60px] h-[70px] w-[70px] min-h-[70px] min-w-[70px] sm:p-3 p-1">
                            <Images
                              imageurl={
                                item?.image?.src ||
                                "/images/image-placeholder.webp"
                              }
                              quality="100"
                              width="100"
                              height="100"
                              title={item?.name || item?.product_name}
                              alt={item?.name || item?.product_name}
                              classes="size-[50px] block mx-auto object-contain"
                              placeholder={true}
                            />
                          </div>
                          <div className="grid gap-[3px]">
                            <h3 className="sm:text-[14px] text-xs text-body leading-relaxed">
                              {item?.name || item?.product_name} x{" "}
                              {item?.quantity}
                            </h3>
                            <div className="flex justify-between"></div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="lg:grid justify-between h-full gap-7">
                    <div className="sm:flex items-center justify-between gap-2">
                      <span className="bg-primary text-white sm:text-[11px] text-[9px] font-semibold uppercase min-w-[70px] flex items-center justify-center py-1 px-2">
                        {locale === "en"
                          ? data?.status
                          : translateStatusToArabic(data?.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-status-line px-5  py-5 sm:pt-5 pt-3 border-t border-border">
                <div className="ui relaxed divided list">
                  <div className="item">
                    <div className="content">
                      <p className="text-[14px] font-bold">
                        {getTranslation(
                          translation[0]?.translations,
                          "Order Placed",
                          locale || "en"
                        )}
                      </p>
                      <div className="text-xs opacity-70 mt-[3px]">
                        {getTranslation(
                          translation[0]?.translations,
                          "Your order has been successfully placed.",
                          locale || "en"
                        )}{" "}
                        {data?.status === "pending" &&
                          getTranslation(
                            translation[0]?.translations,
                            "We're preparing it for processing.",
                            locale || "en"
                          )}
                        <div className="mt-2 text-[10px] text-gray-500">
                          {formatDateStringWithTime(data?.date_created)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {data?.status !== "cancelled" &&
                    getOrderStatus(data?.status, locale) !==
                      "Unknown Status" && (
                      <div className="item">
                        <div className="content">
                          <p
                            className={`${
                              data?.status === "completed" && "text-primary"
                            } text-[14px] font-bold`}
                          >
                            {getTranslation(
                              translation[0]?.translations,
                              "Order",
                              locale || "en"
                            )}{" "}
                            {getTranslation(
                              translation[0]?.translations,
                              getOrderStatus(data?.status, locale),
                              locale || "en"
                            )}
                          </p>
                          <div className="text-xs opacity-70 mt-[3px]">
                            {getTranslation(
                              translation[0]?.translations,
                              "Your order is now being",
                              locale || "en"
                            )}{" "}
                            {getTranslation(
                              translation[0]?.translations,
                              getOrderStatus(data?.status, locale),
                              locale || "en"
                            )}
                            .{" "}
                            {data?.status !== "completed" &&
                              data?.status !== "order-delivered" &&
                              getTranslation(
                                translation[0]?.translations,
                                "Stay tuned for updates!",
                                locale || "en"
                              )}
                            <div className="mt-2 text-[10px] text-gray-500">
                              {formatDateStringWithTime(data?.date_modified)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {data?.status === "cancelled" && (
                    <div className="item">
                      <div className="content">
                        <p className="text-[14px] font-bold text-red-600">
                          {getTranslation(
                            translation[0]?.translations,
                            "Order Cancelled",
                            locale || "en"
                          )}
                        </p>
                        <div className="text-xs opacity-70 mt-[3px]">
                          {getTranslation(
                            translation[0]?.translations,
                            "Order has been cancelled.",
                            locale || "en"
                          )}

                          {cancellationReason?.value && (
                            <div className="mt-2 bg-red-500 bg-opacity-10 p-2">
                              <span className="block mb-1 text-[9px] uppercase">
                                {getTranslation(
                                  translation[0]?.translations,
                                  getTranslation(
                                    translation[0]?.translations,
                                    "Reason",
                                    locale || "en"
                                  ),
                                  locale || "en"
                                )}
                              </span>
                              {cancellationReason?.value}
                            </div>
                          )}
                          <div className="mt-2 text-[10px] text-gray-500">
                            {formatDateStringWithTime(data?.date_modified)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

{data?.status === "refunded" && (
                      <div className="item">
                        <div className="content">
                          <p className="text-[14px] font-bold">
                            {getTranslation(
                              translation[0]?.translations,
                              getTranslation(
                                translation[0]?.translations,
                                "Refund Initiated",
                                locale || "en"
                              ),
                              locale || "en"
                            )}
                          </p>
                          <div className="text-xs opacity-70 mt-[3px]">
                            {getTranslation(
                              translation[0]?.translations,
                              "Your refund has been successfully processed. The amount will be credited to your account within 7 working days.",
                              locale || "en"
                            )}

                            <div className="mt-2 text-[10px] text-gray-500">
                              {formatDateStringWithTime(data?.date_modified)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

{data?.status === "refunded" &&
                     data?.refunds?.length !== 0 && (
                      <div className="item">
                        <div className="content">
                          <p className="text-[14px] font-bold">
                            {getTranslation(
                              translation[0]?.translations,
                              getTranslation(
                                translation[0]?.translations,
                                "Refund Initiated",
                                locale || "en"
                              ),
                              locale || "en"
                            )}
                          </p>
                          <div className="text-xs opacity-70 mt-[3px]">
                            {getTranslation(
                              translation[0]?.translations,
                              "Your refund has been successfully processed. The amount will be credited to your account within 7 working days.",
                              locale || "en"
                            )}

                            <div className="mt-2 text-[10px] text-gray-500">
                              {formatDateStringWithTime(data?.date_modified)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {data?.status === "cancelled" &&
                    data?.payment_method !== "cash_on_delivery" &&
                     (
                      <div className="item">
                        <div className="content">
                          <p className="text-[14px] font-bold">
                            {getTranslation(
                              translation[0]?.translations,
                              getTranslation(
                                translation[0]?.translations,
                                "Refund Initiated",
                                locale || "en"
                              ),
                              locale || "en"
                            )}
                          </p>
                          <div className="text-xs opacity-70 mt-[3px]">
                            {getTranslation(
                              translation[0]?.translations,
                              "Your refund has been successfully processed. The amount will be credited to your account within 7 working days.",
                              locale || "en"
                            )}

                            <div className="mt-2 text-[10px] text-gray-500">
                              {formatDateStringWithTime(data?.date_modified)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {(data?.status === "return-initiated" ||
                    data?.status === "return-approved" ||
                    data?.status === "return-rejected" ||
                    data?.status === "return-completed") && (
                    <div className="item">
                      <div className="content">
                        <p
                          className={`${
                            data?.status === "return-rejected" ||
                            data?.status === "return-initiated"
                              ? "text-red-500"
                              : ""
                          } text-[14px] font-bold capitalize`}
                        >
                          {data?.status?.replace("-", " ")}
                        </p>
                        <div className="text-xs opacity-70 mt-[3px]">
                          {data?.status === "return-initiated" &&
                            getTranslation(
                              translation[0]?.translations,
                              "Your return is checking for approvals. We’ll keep you updated on the next steps.",
                              locale || "en"
                            )}
                          {data?.status === "return-approved" &&
                            getTranslation(
                              translation[0]?.translations,
                              "Your return has been approved. We’ll proceed with the next steps and keep you updated.",
                              locale || "en"
                            )}
                          {data?.status === "return-rejected" &&
                            getTranslation(
                              translation[0]?.translations,
                              "Your return has been rejected.",
                              locale || "en"
                            )}
                          {data?.status === "return-completed" &&
                            getTranslation(
                              translation[0]?.translations,
                              "Your return has been completed.",
                              locale || "en"
                            )}

                          {data?.status !== "return-initiated" &&
                            data?.status !== "return-approved" &&
                            data?.status !== "return-completed" &&
                            returnRejectionReason &&
                            returnRejectionReason?.value && (
                              <div className="mt-2 bg-red-500 bg-opacity-10 p-2">
                                <span className="block mb-1 text-[9px] uppercase">
                                  {getTranslation(
                                    translation[0]?.translations,
                                    "Reason",
                                    locale || "en"
                                  )}
                                </span>
                                {returnRejectionReason?.value}
                              </div>
                            )}
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500">
                          {formatDateStringWithTime(data?.date_modified)}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
              <div className="border-t border-border py-2 px-2 flex items-center justify-between">
                <small className="text-xs font-normal">
                  {getTranslation(
                    translation[0]?.translations,
                    "Order ID",
                    locale || "en"
                  )}{" "}
                  #{data?.id}
                </small>
                <small className="text-xs font-normal">
                  {formatDateStringWithTime(data?.date_created)}
                </small>
              </div>
            </>
          ) : (
            <Link
              className="w-full"
              href={`${pathname}/${userInfo?.id}/${data?.id}`}
            >
              <div className="lg:flex items-start justify-between w-full gap-3">
                <div className="flex gap-[10px] justify-between w-full">
                  <div className="grid gap-[10px] py-2">
                    {data &&
                      data?.line_items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex sm:gap-4 gap-2 items-center"
                        >
                          <div className="flex items-center sm:h-[60px] sm:w-[60px] h-[70px] w-[70px] min-h-[70px] min-w-[70px] sm:p-3 p-1">
                            <Images
                              imageurl={
                                item?.image?.src ||
                                "/images/image-placeholder.webp"
                              }
                              quality="100"
                              width="100"
                              height="100"
                              title={item?.name || item?.product_name}
                              alt={item?.name || item?.product_name}
                              classes="size-[50px] block mx-auto object-contain"
                              placeholder={true}
                            />
                          </div>
                          <div className="grid gap-[3px]">
                            <h3 className="sm:text-[14px] text-xs text-body leading-relaxed">
                              {item?.name || item?.product_name} x{" "}
                              {item?.quantity}
                            </h3>
                            <div className="flex justify-between"></div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="lg:grid justify-between h-full gap-7">
                    <div className="sm:flex items-center justify-between gap-2">
                      <span className="bg-primary text-white sm:text-[11px] text-[9px] font-semibold uppercase min-w-[70px] flex items-center justify-center py-1 px-2">
                        {locale === "en"
                          ? data?.status
                          : translateStatusToArabic(data?.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-border py-2 px-2 flex items-center justify-between">
                <small className="text-xs font-normal">
                  {getTranslation(
                    translation[0]?.translations,
                    "Order ID",
                    locale || "en"
                  )}{" "}
                  #{data?.id}
                </small>
                <small className="text-xs font-normal">
                  {formatDateStringWithTime(data?.date_created)}
                </small>
              </div>
              {data?.tracking_message && !orderView && (
                <div className="mt-4">
                  <Alerts status="green" title={data?.tracking_message} />
                </div>
              )}
            </Link>
          )}
        </li>
      )}
    </>
  );
}
