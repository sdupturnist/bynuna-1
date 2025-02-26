// Single Pack,
// Buy1 Get 1Free (+₹325.00):1299

"use client";

import { useEffect, useMemo, useState } from "react";
import { useCartContext } from "../Context/cartContext";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import AddToWishList from "./AddToWishList";
import Link from "next/link";
import { apiUrl, getTranslation, homeUrl, siteName } from "../Utils/variables";
import Notification from "./Notification";
import Swal from "sweetalert2";
import { userId } from "../Utils/UserInfo";
import { useAuthContext } from "../Context/authContext";

import { useRouter } from "nextjs-toploader/app";

import { useLanguageContext } from "../Context/LanguageContext";

import { useParams } from "next/navigation";

export default function AddToCart({
  itemid,
  price,
  name,
  inCartPage,
  card,
  image,
  slug,
  active,
  singlePage,
  isNeedLicence,
}) {

  const router = useRouter();
    const params = useParams();  
    const locale = params.locale; 


  const { cartItems, setCartItems, setCart, setDiscount, setCouponCode } =
    useCartContext();

  const { validUserTocken } = useAuthContext(); 



  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);

  const [isActiveWishList, setIsActiveWishList] = useState(active);
  const [loading, setLoading] = useState(true);
  const [cartAddQty, setCartAddQty] = useState(false);
  const [showGotoCartBtn, setShowGotoCartBtn] = useState(false);


  const { translation } = useLanguageContext();

  useEffect(() => {
    if (itemid) {
      setLoading(false);
    }
  }, [itemid]);

  useEffect(() => {
    const savedWishlist =
      JSON.parse(typeof window !== "undefined" && localStorage.getItem(`${siteName}_wishlist`)) || [];
    if (savedWishlist.includes(itemid)) {
      setIsActiveWishList(true);
    }
  }, [itemid]);

  const safeCartItems = useMemo(
    () => (Array.isArray(cartItems) ? cartItems : []),
    [cartItems]
  );

  useEffect(() => {
    const currentItem = safeCartItems.find((item) => item.id === itemid);
    if (currentItem) {
      setQuantity(currentItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [safeCartItems, itemid]);

  const checkUser = async () => {
    fetch(`${apiUrl}wp-json/wishlist/v1/items?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    validUserTocken && userId && checkUser();
  }, []);

  const updateCartLengthCookie = async (updatedCartItems) => {
    const cartLength = updatedCartItems.length;

    try {
      const response = await fetch(`${homeUrl}${locale}/api/setCookie/cart-length`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItemsLength: cartLength }),
      });

      if (response.ok) {
        // Successfully updated cart length in cookie
        const data = await response.json();
      } else {
        // If the response status is not OK, log failure
      }
    } catch (error) {
      // Log any error that occurred during the fetch
    }
  };

  // Function to update cart in localStorage
  const updateCartInLocalStorage = (updatedCartItems) => {
    //localStorage.setItem(`${siteName}_cart`, updatedCartItems);
    localStorage.setItem(`${siteName}_cart`, JSON.stringify(updatedCartItems));
    updateCartLengthCookie(updatedCartItems); // Update cookie with cart length
  };

  // Check if item is in the cart
  //const isInCart = safeCartItems.some((cartItem) => cartItem.id === itemid);
  const isInCart = safeCartItems.some((cartItem) => cartItem.slug === slug);

  const addToCart = (seletedOption, image, price, name, isNeedLicence) => {
    setCartAddQty(true);

    if (isInCart) {
      // Remove item from cart
      const updatedCartItems = safeCartItems.filter(
        (cartItem) => cartItem.id !== itemid
      );

      setCouponCode(false);
      setDiscount(0);

      setCartItems(updatedCartItems);
      updateCartInLocalStorage(updatedCartItems);
    } else {
      // Add item to cart
      const newObject = {
        id: itemid,
        product_id: itemid,
        quantity: 1,
        price: parseInt(price),
        name: name,
        image: image,
        option: seletedOption || null,
        slug: slug,
        isNeedLicence: isNeedLicence,
      };

      const updatedCartItems = [...safeCartItems, newObject];
      setCartItems(updatedCartItems);
      setDiscount(0);

      updateCartInLocalStorage(updatedCartItems);

      setNotification({
        message: getTranslation(
          translation[0]?.translations,
          `Item added to your cart.`,
          locale || 'en'
        ),
        type: "success",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Function to handle cart action (Add/Remove)
  const handleCartAction = (
    seletedOption,
    image,
    price,
    name,
    isNeedLicence
  ) => {
    if (!isInCart && isNeedLicence === 1) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-light",
          denyButton: "btn btn-light",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          showDenyButton: true,
          confirmButtonText: getTranslation(
            translation[0]?.translations,
            "Save",
            locale || 'en'
          ),
          denyButtonText: getTranslation(
            translation[0]?.translations,
            "Cancel",
            locale || 'en'
          ),

          title: getTranslation(
            translation[0]?.translations,
            'Please Check the statements below - if you agree, click "Agree & Proceed"',
            locale || 'en'
          ),

          html:
            locale  === "en"
              ? "SGC Will only send restricted items in this instance an Airgun to our branches or a 3rd Party Registered Firearms Dealer For collection of this item you are required to present a valid form of Identification. When ordering this product you understand a member of staff will contact you to discuss delivery and collection options. You understand that a 3rd Party Gun Dealer may charge a small fee (typically £0-£25.00) If returning goods you are to ensure they are not charged, cocked or loaded and are in a safe condition to travel by a normal carrier network. You confirm you are over 18 Years old and you understand the Terms and Conditions."
              : `سترسل شركة SGC فقط العناصر المحظورة في هذه الحالة، وهي بندقية هوائية، إلى فروعنا أو إلى تاجر أسلحة نارية مسجل تابع لجهة خارجية.
لجمع هذا العنصر، يتعين عليك تقديم نموذج صالح من بطاقة الهوية.
عند طلب هذا المنتج، فأنت تفهم أن أحد أعضاء الموظفين سيتصل بك لمناقشة خيارات التسليم والاستلام.
أنت تفهم أن تاجر الأسلحة النارية التابع لجهة خارجية قد يفرض رسومًا صغيرة (عادةً ما تكون 0 جنيه إسترليني إلى 25.00 جنيه إسترليني)
إذا كنت ترغب في إرجاع البضائع، فيجب عليك التأكد من أنها غير مشحونة أو مسلحة أو محملة وأنها في حالة آمنة للسفر عبر شبكة نقل عادية.
أنت تؤكد أنك أكبر من 18 عامًا وأنك تفهم الشروط والأحكام.`,

          icon: false,
          confirmButtonText: getTranslation(
            translation[0]?.translations,
            "Agree and proceed",
            locale || 'en'
          ),
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            // If confirmed, add to cart
            addToCart(seletedOption, image, price, name, isNeedLicence);
            return true;
          } else if (result.isDenied || result.isDismissed) {
            // If canceled or dismissed, return false and close
            return false;
          }
        });

      return false; // Prevent default action
    }

    addToCart(seletedOption, image, price, name, isNeedLicence);
  };

  // Function to increase item quantity
  const CartPlus = (seletedOption) => {
    const updatedCartItems = safeCartItems.map((item) =>
      item.id === itemid
        ? { ...item, quantity: item.quantity + 1 } // Increase quantity
        : item
    );

    // If item does not exist, add it with quantity 1
    if (!updatedCartItems.some((item) => item.id === itemid)) {
      updatedCartItems.push({
        id: itemid,
        product_id: itemid,
        quantity: 1,
        price: parseInt(price),
        name: name,
        image: image,
        // option: seletedOption || null,
        slug: slug,
        isNeedLicence: isNeedLicence,
      });
    }

    setCouponCode(false);
    setDiscount(0);

    setCartItems(updatedCartItems);
    updateCartInLocalStorage(updatedCartItems);

    // Update local quantity state
    setQuantity((prevQuantity) => prevQuantity + 1);

    singlePage &&
      setNotification({
        message: getTranslation(
          translation[0]?.translations,
          `Item added to your cart.`,
          locale || 'en'
        ),
        type: "success",
      });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Function to decrease item quantity
  const CartMinus = () => {
    const itemInCart = safeCartItems.find((item) => item.id === itemid);

    if (itemInCart) {
      if (itemInCart.quantity > 1) {
        // Update quantity if greater than 1
        const updatedCartItems = safeCartItems.map((item) =>
          item.id === itemid
            ? { ...item, quantity: item.quantity - 1 } // Decrease quantity
            : item
        );
        setCouponCode(false);
        setDiscount(0);

        setCartItems(updatedCartItems);
        updateCartInLocalStorage(updatedCartItems);
        setQuantity((prevQuantity) => prevQuantity - 1);
      } else {
        // Remove item if quantity is 1
        const updatedCartItems = safeCartItems.filter(
          (item) => item.id !== itemid
        );
        setCartItems(updatedCartItems);
        // updateCartInLocalStorage(updatedCartItems);
        setQuantity(0);
        setDiscount(0);
      }
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };



  const removeFromCartConfirm = (id, name) => {
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
        text: getTranslation(
          translation[0]?.translations,
          `Do you need to remove item from the list?`,
          locale || 'en'
        ),
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
      .then((result) => {
        if (result.isConfirmed) {
          const updatedCartItems = cartItems.filter((item) => item.id !== id);
          setCartItems(updatedCartItems);
          // localStorage.setItem(`${siteName}_cart`,updatedCartItems);
          localStorage.setItem(
            `${siteName}_cart`,
            JSON.stringify(updatedCartItems)
          );
          updateCartLengthCookie(updatedCartItems); // Update cookie with cart length
        }
      });
  };

  


  return (
    <>
      {notification && (
        <Notification
          url={`${homeUrl}${locale}/cart`}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {card ? (
        <>
          <button
            className={`${
              isInCart ? "bg-primary text-white" : "bg-white"
            }  hover:bg-primary hover:text-white lg:rounded-full lg:size-[60px] size-auto lg:min-w-fit min-w-[60px] w-full sm:py-2 py-1 px-3 sm:px-5 gap-[5px] uppercase primary-font transition-all text-[10px] lg:text-base items-center justify-center flex lg:pt-1 border border-border`}
            onClick={(e) =>
              handleCartAction(name, image, price, name, isNeedLicence)
            }
          >
            <i className="bi bi-bag mb-1 mt-1 lg:mb-0"></i>
         <span className="lg:hidden">
         {isInCart
                      ? getTranslation(
                          translation[0]?.translations,
                          "Remove",
                          locale || 'en'
                        )
                      : getTranslation(
                          translation[0]?.translations,
                          "Add",
                          locale || 'en'
                        )}
         </span>
          </button>
        </>
      ) : (
        <div className="items-end flex justify-between lg:mt-0 gap-3">
          <div
            className={`${
              !inCartPage ? "w-auto" : "w-24 sm:w-32"
            } flex items-center justify-center gap-3 lg:order-first order-last w-full`}
          >
            {/* FOR CART */}
            {inCartPage && (
              <div className="border-primary bg-primary-dim h-11 [&>*]:text-primary flex items-center border rounded-none w-full justify-between lg:max-w-40">
                <button
                  className="px-2 py-2 hover:opacity-50 transition-all text-dark"
                  onClick={CartMinus}
                >
                  <MinusIcon className={` size-4 font-semibold`} />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="text-center w-full !px-0 !h-full !border-none bg-primary-dim !text-primary primary-font "
                />
                <button
                  className="py-2 hover:opacity-50 transition-all text-dark px-2"
                  onClick={(e) => CartPlus(price)}
                >
                  <PlusIcon className="font-semibold size-4" />
                </button>
              </div>
            )}

            {/* FOR SINGLE */}

            {!inCartPage && cartAddQty && (
              <div
                className={`${
                  !inCartPage
                    ? "h-14"
                    : "border-primary bg-primary-dim h-11 [&>*]:text-primary"
                } h-14 flex items-center border rounded-none  w-full justify-between lg:max-w-40`}
              >
                <button
                  className={` px-4 py-2 hover:opacity-50 transition-all text-dark`}
                  onClick={CartMinus}
                >
                  <MinusIcon className={` size-5 font-semibold`} />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className={` text-center w-full !px-0 !h-full !border-none`}
                />
                <button
                  className={` px-4 py-2 hover:opacity-50 transition-all text-dark`}
                  onClick={CartPlus}
                >
                  <PlusIcon className={`size-5 font-semibold`} />
                </button>
              </div>
            )}

            {!inCartPage && (
              <>
                {!isInCart && (
                  <button
                    onClick={() => {
                      handleCartAction(name, image, price, name, isNeedLicence);
                      setShowGotoCartBtn(true);
                    }}
                    className="btn !min-h-14 px-8 w-fit"
                  >
                    {isInCart
                      ? getTranslation(
                          translation[0]?.translations,
                          "Go to cart",
                          locale || 'en'
                        )
                      : getTranslation(
                          translation[0]?.translations,
                          "Add to cart",
                          locale || 'en'
                        )}
                  </button>
                )}

                {isInCart && (
                  <Link
                    href={`${homeUrl}${locale}/cart`}
                    className="btn !min-h-14 px-8 w-fit"
                  >
                    {getTranslation(
                      translation[0]?.translations,
                      "Go to cart",
                      locale || 'en'
                    )}
                  </Link>
                )}

                {!singlePage && (
                  <AddToWishList
                    activeWishlist={itemid}
                    itemName={name}
                    productId={itemid}
                  />
                )}
              </>
            )}
          </div>

          {inCartPage && (
            <div className="flex justify-end relative">
              <div className="flex items-center justify-between gap-3">
                {/* <AddToWishList
                  inCartPage
                  activeWishlist={itemid}
                  itemName={name}
                  productId={itemid}
                /> */}
                <button
                  className="btn-small border border-border  btn"
                  onClick={() => removeFromCartConfirm(itemid, name)}
                >
                  {getTranslation(
                    translation[0]?.translations,
                    "Remove",
                    locale || 'en'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
