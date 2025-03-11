"use client";

import { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { userId } from "../Utils/UserInfo"; // Assuming userId is coming from this file
import { isLoggined } from "../Utils/checkAuth";
import { useRouter } from "nextjs-toploader/app";
import LoadingItem from "./LoadingItem";
import { useAuthContext } from "../Context/authContext";
import {
  apiUrl,
  getTranslation,
  siteName,
  woocommerceKey,
} from "../Utils/variables";
import { useSiteContext } from "../Context/siteContext";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams } from "next/navigation";

export default function AddToWishList({
  productId,
  small,
  onWishlistChange,
  inCartPage,
  inSinglePage,
  smallCardTop,
}) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { translation } = useLanguageContext();

  const { validUserTocken, userData } = useAuthContext();
  const { activeWishlist, setActiveWishlist, setHideCartItem } =
    useSiteContext();
  const [isLoading, setIsLoading] = useState(false);
  //const [activeWishlist, setactiveWishlist] = useState([]);

  // Fetch wishlist from sessionStorage or activeWishlist on client-side only
  // useEffect(() => {
  //   const storedWishlist = JSON.parse(
  //     sessionStorage.getItem(`${siteName}_wishlist_data`)
  //   );
  //   setActiveWishlist(storedWishlist || activeWishlist);
  // }, [activeWishlist]);

  const handleClickAdd = (userId, productId) => {
    if (!validUserTocken) {
      isLoggined(
        validUserTocken,
        router,
        null,
        getTranslation(
          translation[0]?.translations,
          "Login to Add to Wishlist",
          locale || "en"
        ),
        getTranslation(
          translation[0]?.translations,
          "Please log in to your account to add this item to your wishlist.",
          locale || "en"
        ),
        getTranslation(translation[0]?.translations, "Login", locale || "en"),
        getTranslation(translation[0]?.translations, "Cancel", locale || "en"),
        params
      );
      return false;
    }

    setIsLoading(true);
    fetch(
      `${apiUrl}wp-json/wishlist/v1/add/${
        userData && userData?.id
      }${woocommerceKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setActiveWishlist(data);
      })
      .catch((error) => {
        console.error("Error updating wishlist:", error);
        // alert("There was an error updating the wishlist. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClickRemove = (userId, productId) => {
    if (!validUserTocken) {
      isLoggined(
        validUserTocken,
        router,
        null,
        getTranslation(
          translation[0]?.translations,
          "Login to Add to Wishlist",
          locale || "en"
        ),
        getTranslation(
          translation[0]?.translations,
          "Please log in to your account to add this item to your wishlist.",
          locale || "en"
        ),
        getTranslation(translation[0]?.translations, "Login", locale || "en"),
        getTranslation(translation[0]?.translations, "Cancel", locale || "en"),
        params
      );
      return false;
    }

    setIsLoading(true);

    fetch(
      `${apiUrl}wp-json/wishlist/v1/remove/${
        userData && userData?.id
      }${woocommerceKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setActiveWishlist(data);

        if (onWishlistChange) onWishlistChange(data); // Trigger any callback for wishlist change

        router.refresh(); // Refresh the page or re-fetch the data as needed
      })
      .catch((error) => {
        console.error("Error updating wishlist:", error);
        // Alert can be shown here for user
      })
      .finally(() => {
        setIsLoading(false); // Stop the loading spinner
      });
  };

  if (inSinglePage) {
    return (
      <>
        {activeWishlist &&
          activeWishlist.some((item) => item.id === productId) ? (
          <>
            <button
              title={
                activeWishlist &&
                Object.values(activeWishlist).includes(productId)
                  ? getTranslation(
                      translation[0]?.translations,
                      "Add to wishlist",
                      locale || "en"
                    )
                  : getTranslation(
                      translation[0]?.translations,
                      "Remove from wishlist",
                      locale || "en"
                    )
              }
              onClick={() => handleClickRemove(userId, productId)}
              disabled={isLoading}
              className="remove-from-list  rounded-full size-10 flex items-center justify-center pt-1"
            >
              {isLoading ? (
                <LoadingItem dot classes="size-[16px] !text-white" />
              ) : (
                <i
                  className={`${
                    activeWishlist &&
                    activeWishlist.some((item) => item.id === productId)
                      ? "text-primary bi bi-heart-fill"
                      : "text-black bi bi-heart "
                  }  sm:text-base text-sm`}
                ></i>
              )}
            </button>
          </>
        ) : (
          <button
            title={
              activeWishlist &&
              Object.values(activeWishlist).includes(productId)
                ? getTranslation(
                    translation[0]?.translations,
                    "Add to wishlist",
                    locale || "en"
                  )
                : getTranslation(
                    translation[0]?.translations,
                    "Remove from wishlist",
                    locale || "en"
                  )
            }
            onClick={() => handleClickAdd(userId, productId)}
            disabled={isLoading}
            className="remove-from-list  rounded-full size-10 flex items-center justify-center pt-1"
          >
            {isLoading ? (
              <LoadingItem dot classes="size-[16px]  !text-dark opacity-25" />
            ) : (
              <i className={`text-black bi bi-heart sm:text-base text-sm`}></i>
            )}
          </button>
        )}
      </>
    );
  }

  return (
    <>
      {inCartPage && (
        <>
          {activeWishlist &&
          activeWishlist.some((item) => item.id === productId) ? (
            <>
              <button
                title={
                  activeWishlist &&
                  Object.values(activeWishlist).includes(productId)
                    ? getTranslation(
                        translation[0]?.translations,
                        "Add to wishlist",
                        locale || "en"
                      )
                    : getTranslation(
                        translation[0]?.translations,
                        "Remove from wishlist",
                        locale || "en"
                      )
                }
                onClick={() => handleClickRemove(userId, productId)}
                disabled={isLoading}
                className="btn px-[13px] !h-[45px] btn-light bg-white border remove-from-list"
              >
                {isLoading ? (
                  <LoadingItem dot classes="size-[16px] !text-white" />
                ) : (
                  <HeartIcon
                    className={`${
                      activeWishlist &&
                      Object.values(activeWishlist).includes(productId)
                        ? "text-primary"
                        : "text-body opacity-25"
                    } size-5`}
                  />
                )}
              </button>
            </>
          ) : (
            <button
              title={
                activeWishlist &&
                Object.values(activeWishlist).includes(productId)
                  ? getTranslation(
                      translation[0]?.translations,
                      "Add to wishlist",
                      locale || "en"
                    )
                  : getTranslation(
                      translation[0]?.translations,
                      "Remove from wishlist",
                      locale || "en"
                    )
              }
              onClick={() => handleClickAdd(userId, productId)}
              disabled={isLoading}
              className="btn px-[13px] btn-light !h-[45px] bg-white border  remove-from-list"
            >
              {isLoading ? (
                <LoadingItem dot classes="size-[16px]  !text-dark opacity-25" />
              ) : (
                <HeartIcon className={`text-body opacity-25 size-5`} />
              )}
            </button>
          )}
        </>
      )}

      {!inCartPage && !small && smallCardTop && (
        <>
          {activeWishlist &&
          activeWishlist.some((item) => item.id === productId) ? (
            <button
              title={
                activeWishlist &&
                Object.values(activeWishlist).includes(productId)
                  ? getTranslation(
                      translation[0]?.translations,
                      "Add to wishlist",
                      locale || "en"
                    )
                  : getTranslation(
                      translation[0]?.translations,
                      "Remove from wishlist",
                      locale || "en"
                    )
              }
              onClick={() => handleClickRemove(userId, productId)}
              disabled={isLoading}
              className={` hover:bg-primary hover:text-white rounded-full size-[30px] transition-all items-center justify-center flex pt-1`}
            >
              {isLoading ? (
                <LoadingItem dot classes="size-[16px] !text-white" />
              ) : (
                <i className="bi bi-heart-fill text-primary text-sm"></i>
              )}
            </button>
          ) : (
            <button
              title={
                activeWishlist &&
                Object.values(activeWishlist).includes(productId)
                  ? getTranslation(
                      translation[0]?.translations,
                      "Add to wishlist",
                      locale || "en"
                    )
                  : getTranslation(
                      translation[0]?.translations,
                      "Remove from wishlist",
                      locale || "en"
                    )
              }
              onClick={() => handleClickAdd(userId, productId)}
              disabled={isLoading}
              className={`${
                activeWishlist &&
                Object.values(activeWishlist).includes(productId)
                  ? " bg-primary hover:bg-primary hover:text-white"
                  : " bg-white hover:bg-primary hover:text-white"
              } rounded-full size-[30px] transition-all items-center justify-center flex pt-1`}
            >
              {isLoading ? (
                <LoadingItem dot classes="size-[16px]  !text-dark opacity-25" />
              ) : (
                <i className={`bi bi-heart sm:text-base text-sm`}></i>
              )}
            </button>
          )}
        </>
      )}

      {!inCartPage && !smallCardTop && small && (
        <>
          {activeWishlist &&
          activeWishlist?.some((item) => item.id === productId) ? (
            <button
              title={
                activeWishlist &&
                Object.values(activeWishlist).includes(productId)
                  ? getTranslation(
                      translation[0]?.translations,
                      "Add to wishlist",
                      locale || "en"
                    )
                  : getTranslation(
                      translation[0]?.translations,
                      "Remove from wishlist",
                      locale || "en"
                    )
              }
              onClick={() => handleClickRemove(userId, productId)}
              disabled={isLoading}
              className={`bg-primary hover:bg-primary hover:text-white rounded-full lg:size-[60px] size-[40px] transition-all items-center justify-center flex pt-1 border border-border`}
            >
              {isLoading ? (
                <LoadingItem dot classes="size-[16px] !text-white" />
              ) : (
                <i className="bi bi-heart-fill text-white text-sm"></i>
              )}
            </button>
          ) : (
            <button
              title={
                activeWishlist &&
                Object.values(activeWishlist).includes(productId)
                  ? getTranslation(
                      translation[0]?.translations,
                      "Add to wishlist",
                      locale || "en"
                    )
                  : getTranslation(
                      translation[0]?.translations,
                      "Remove from wishlist",
                      locale || "en"
                    )
              }
              onClick={() => handleClickAdd(userId, productId)}
              disabled={isLoading}
              className={`${
                activeWishlist &&
                Object.values(activeWishlist).includes(productId)
                  ? " bg-primary hover:bg-primary hover:text-white"
                  : " bg-white hover:bg-primary hover:text-white"
              } rounded-full lg:size-[60px] size-[40px] transition-all items-center justify-center flex pt-1 border border-border`}
            >
              {isLoading ? (
                <LoadingItem dot classes="size-[16px]  !text-dark opacity-25" />
              ) : (
                <i className={`bi bi-heart sm:text-base text-sm`}></i>
              )}
            </button>
          )}
        </>
      )}

      {!inCartPage && !small && !smallCardTop && (
        <>
          {activeWishlist &&
          activeWishlist.some((item) => item.id === productId) ? (
            <button
              title={
                activeWishlist &&
                Object.values(activeWishlist).includes(productId)
                  ? getTranslation(
                      translation[0]?.translations,
                      "Add to wishlist",
                      locale || "en"
                    )
                  : getTranslation(
                      translation[0]?.translations,
                      "Remove from wishlist",
                      locale || "en"
                    )
              }
              onClick={() => handleClickRemove(userId, productId)}
              disabled={isLoading}
              className="btn-light bg-white border !min-h-14 !px-4 remove-from-list"
            >
              {isLoading ? (
                <Loading dot classes="size-[16px] !text-white" />
              ) : (
                <HeartIcon
                  className={`${
                    activeWishlist &&
                    Object.values(activeWishlist).includes(productId)
                      ? "text-primary"
                      : "text-body opacity-25"
                  } size-6`}
                />
              )}
            </button>
          ) : (
            <button
              title={
                activeWishlist &&
                Object.values(activeWishlist).includes(productId)
                  ? getTranslation(
                      translation[0]?.translations,
                      "Remove from wishlist",
                      locale || "en"
                    )
                  : getTranslation(
                      translation[0]?.translations,
                      "Add to wishlist",
                      locale || "en"
                    )
              }
              onClick={() => handleClickAdd(userId, productId)}
              disabled={isLoading}
              className="btn-light bg-white border !min-h-14 !px-4 remove-from-list"
            >
              {isLoading ? (
                <Loading dot classes="size-[16px]  !text-dark opacity-25" />
              ) : (
                <HeartIcon className={`text-body opacity-25 size-6`} />
              )}
            </button>
          )}
        </>
      )}
    </>
  );
}
