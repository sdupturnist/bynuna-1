"use client";

import { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { userId } from "../Utils/UserInfo"; // Assuming userId is coming from this file
import { isLoggined } from "../Utils/checkAuth";
import { useRouter } from 'nextjs-toploader/app';
import LoadingItem from "./LoadingItem";
import { useAuthContext } from "../Context/authContext";
import { apiUrl, getTranslation, siteName } from "../Utils/variables";
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

  const { validUserTocken } = useAuthContext();
  const { activeWishlist, setHideCartItem } = useSiteContext();
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch wishlist from sessionStorage or activeWishlist on client-side only
  useEffect(() => {
    const storedWishlist = JSON.parse(
      sessionStorage.getItem(`${siteName}_wishlist_data`)
    );
    setWishlistItems(storedWishlist || activeWishlist);
  }, [activeWishlist]);

  const handleClickAdd = (userId, productId) => {
    if (!validUserTocken) {
      isLoggined(
      validUserTocken,
        router,
        null,
        getTranslation(translation[0]?.translations,   "Login to Add to Wishlist", locale || 'en'),
        getTranslation(translation[0]?.translations,   "Please log in to your account to add this item to your wishlist.", locale || 'en'),
        getTranslation(translation[0]?.translations,   "Login", locale || 'en'),
        getTranslation(translation[0]?.translations,   "Cancel", locale || 'en'),
      );
      return false;
    }

    setIsLoading(true);
    fetch(`${apiUrl}wp-json/wishlist/v1/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        let wishlist =
          JSON.parse(sessionStorage.getItem(`${siteName}_wishlist_data`)) || {};

        let nextKey = Object.keys(wishlist).length;
        wishlist[nextKey] = productId;

        const filteredWishlist = Object.values(wishlist).filter(
          (item) => item !== null
        );

        sessionStorage.setItem(
          `${siteName}_wishlist_data`,
          JSON.stringify(filteredWishlist)
        );
        setWishlistItems(filteredWishlist);

        if (onWishlistChange) onWishlistChange(data);
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
        getTranslation(translation[0]?.translations,   "Login to Add to Wishlist", locale || 'en'),
        getTranslation(translation[0]?.translations,   "Please log in to your account to add this item to your wishlist.", locale || 'en'),
        getTranslation(translation[0]?.translations,   "Login", locale || 'en'),
        getTranslation(translation[0]?.translations,   "Cancel", locale || 'en'),
        
      );
      return false;
    }

    setIsLoading(true);
    fetch(`${apiUrl}wp-json/wishlist/v1/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        let wishlist =
          JSON.parse(sessionStorage.getItem(`${siteName}_wishlist_data`)) || {};

        setHideCartItem((prevState) => ({
          ...prevState,
          [productId]: true, // Hide this product
        }));

        for (let key in wishlist) {
          if (wishlist[key] === productId) {
            delete wishlist[key];
            break;
          }
        }

        const filteredWishlist = Object.keys(wishlist)
          .filter((key) => wishlist[key] !== null)
          .reduce((obj, key) => {
            obj[key] = wishlist[key];
            return obj;
          }, {});

        sessionStorage.setItem(
          `${siteName}_wishlist_data`,
          JSON.stringify(filteredWishlist)
        );
        setWishlistItems(filteredWishlist);

        if (onWishlistChange) onWishlistChange(data);
      })
      .catch((error) => {
        console.error("Error updating wishlist:", error);
        //  alert("There was an error updating the wishlist. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (inSinglePage) {
    return (
      <>
        {wishlistItems && Object.values(wishlistItems).includes(productId) ? (
          <button
            title={
              wishlistItems && Object.values(wishlistItems).includes(productId)
                ? 
                getTranslation(translation[0]?.translations,   "Add to wishlist", locale || 'en')
                :
                getTranslation(translation[0]?.translations,   "Remove from wishlist", locale || 'en')
             
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
                  wishlistItems &&
                  Object.values(wishlistItems).includes(productId)
                    ? "text-primary bi bi-heart-fill"
                    : "text-black bi bi-heart "
                }  sm:text-base text-sm`}
              ></i>
            )}
          </button>
        ) : (
          <button
            title={
              wishlistItems && Object.values(wishlistItems).includes(productId)
                ? 
                getTranslation(translation[0]?.translations,   "Add to wishlist", locale || 'en')
  :
                getTranslation(translation[0]?.translations,   "Remove from wishlist", locale || 'en')
              
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
          {wishlistItems && Object.values(wishlistItems).includes(productId) ? (
            <button
              title={
                wishlistItems &&
                Object.values(wishlistItems).includes(productId)
                  ? getTranslation(translation[0]?.translations,   "Add to wishlist", locale || 'en')
                  : getTranslation(translation[0]?.translations,   "Remove from wishlist", locale || 'en')
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
                    wishlistItems &&
                    Object.values(wishlistItems).includes(productId)
                      ? "text-primary"
                      : "text-body opacity-25"
                  } size-5`}
                />
              )}
            </button>
          ) : (
            <button
              title={
                wishlistItems &&
                Object.values(wishlistItems).includes(productId)
                  ? getTranslation(translation[0]?.translations,   "Add to wishlist", locale || 'en')
                  : getTranslation(translation[0]?.translations,   "Remove from wishlist", locale || 'en')
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
          {wishlistItems && Object.values(wishlistItems).includes(productId) ? (
            <button
              title={
                wishlistItems &&
                Object.values(wishlistItems).includes(productId)
                  ? getTranslation(translation[0]?.translations,   "Add to wishlist", locale || 'en')
                  : getTranslation(translation[0]?.translations,   "Remove from wishlist", locale || 'en')
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
                wishlistItems &&
                Object.values(wishlistItems).includes(productId)
                  ? getTranslation(translation[0]?.translations,   "Add to wishlist", locale || 'en')
                  : getTranslation(translation[0]?.translations,   "Remove from wishlist", locale || 'en')
              }
              onClick={() => handleClickAdd(userId, productId)}
              disabled={isLoading}
              className={`${
                wishlistItems &&
                Object.values(wishlistItems).includes(productId)
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
          {wishlistItems && Object.values(wishlistItems).includes(productId) ? (
            <button
              title={
                wishlistItems &&
                Object.values(wishlistItems).includes(productId)
                  ? getTranslation(translation[0]?.translations,   "Add to wishlist", locale || 'en')
                  : getTranslation(translation[0]?.translations,   "Remove from wishlist", locale || 'en')
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
                wishlistItems &&
                Object.values(wishlistItems).includes(productId)
                  ? getTranslation(translation[0]?.translations,   "Add to wishlist", locale || 'en')
                  : getTranslation(translation[0]?.translations,   "Remove from wishlist", locale || 'en')
              }
              onClick={() => handleClickAdd(userId, productId)}
              disabled={isLoading}
              className={`${
                wishlistItems &&
                Object.values(wishlistItems).includes(productId)
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
          {wishlistItems && Object.values(wishlistItems).includes(productId) ? (
            <button
              title={
                wishlistItems &&
                Object.values(wishlistItems).includes(productId)
                  ? getTranslation(translation[0]?.translations,   "Add to wishlist", locale || 'en')
                  : getTranslation(translation[0]?.translations,   "Remove from wishlist", locale || 'en')
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
                    wishlistItems &&
                    Object.values(wishlistItems).includes(productId)
                      ? "text-primary"
                      : "text-body opacity-25"
                  } size-6`}
                />
              )}
            </button>
          ) : (
            <button
              title={
                wishlistItems &&
                Object.values(wishlistItems).includes(productId)
                  ? getTranslation(translation[0]?.translations,   "Remove from wishlist", locale || 'en')
                  : getTranslation(translation[0]?.translations,   "Add to wishlist", locale || 'en')
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
