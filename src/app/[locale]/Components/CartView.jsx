"use client";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import CartListItem from "./CartListItem";
import AmountList from "./AmountList";
import CouponCode from "./CouponCode";
import { useCartContext } from "../Context/cartContext";
import { getTranslation, homeUrl, siteName } from "../Utils/variables";
import { useRouter } from "nextjs-toploader/app";
import { useAuthContext } from "../Context/authContext"; // import useAuthContext here
import Swal from "sweetalert2";
import PaymentOptions from "./PaymentOptions";
import Alerts from "./Alerts";
import { useLanguageContext } from "../Context/LanguageContext";

export default function CartView({locale}) {

  const router = useRouter();




  const { cartItems, setGuestUser } = useCartContext();

  const { setLoadingAuth, validUserTocken } = useAuthContext(); // Get authentication status
 

  const { translation } = useLanguageContext();

  const handleGuestCheckout = () => {
    if (!validUserTocken) {
      setGuestUser(true);
      setLoadingAuth(false);
      router.push(`${homeUrl}${locale}/checkout`);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-10">
        <Alerts
          buttonLabel={getTranslation(
            translation[0]?.translations,
            "Shop now",
            locale || 'en'
          )}
          cartEmpty
          url={homeUrl}
          button
          center
          image="/images/no_cart.webp"
          noPageUrl
          title={getTranslation(
            translation[0]?.translations,
            "You do not have any items in your cart",
            locale || 'en'
          )}
        />
      </div>
    );
  }

  return (
    <div className={`cart lg:justify-between  lg:gap-0 gap-2 w-full`}>
      <div
        className={`bg-white lg:p-0 py-5 px-4 ${
          !cartItems.length > 0 && "text-center pb-14"
        }`}
      >
        <CartListItem />
      </div>
      {cartItems.length > 0 && (
        <div className="bg-white lg:p-0 p-5 grid lg:grid-cols-2 sm:gap-7 gap-5 sm:!pt-10 pt-0 lg:border-t border-border">
          <div className="w-full">
            <Link
              href={homeUrl}
              className="btn btn-light btn-large lg:!inline-flex !flex sm:w-auto w-full"
            >
              {getTranslation(
                translation[0]?.translations,
                "Continue shopping",
                locale || 'en'
              )}
            </Link>
          </div>
          <div>
            <div className="grid gap-5">
              <CouponCode />
              <SectionHeader
                noSpacing
                title={getTranslation(
                  translation[0]?.translations,
                  "Order summary",
                  locale || 'en'
                )}
                card
              />
              <AmountList />
              <button
                onClick={() => {
                  if (!validUserTocken) {
                    // If not authenticated, show the SweetAlert dialog
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
                        showCancelButton: false,
                        confirmButtonText: getTranslation(
                          translation[0]?.translations,
                          "Save",
                          locale || 'en'
                        ),
                        denyButtonText: getTranslation(
                          translation[0]?.translations,
                          "Guest Checkout",
                          locale || 'en'
                        ),

                        title: getTranslation(
                          translation[0]?.translations,
                          "Login to Checkout",
                          locale || 'en'
                        ),
                        text: getTranslation(
                          translation[0]?.translations,
                          "Log in to your account to continue with the checkout process.",
                          locale || 'en'
                        ),
                        icon: false,
                        // showCancelButton: true, // Show cancel button
                        confirmButtonText: getTranslation(
                          translation[0]?.translations,
                          "Login",
                          locale || 'en'
                        ),
                        // cancelButtonText: "Guest checkout",
                        reverseButtons: true,
                      })
                      .then((result) => {
                        if (result.isConfirmed) {
                          // If user confirms (clicks "Login")
                          router.push(
                            `${homeUrl}${locale}/auth/login?login-status=false`
                          );
                        } else if (result.isDenied) {
                          // If user cancels (clicks "Guest checkout")
                          setGuestUser(true);
                          router.push(`${homeUrl}${locale}/checkout`);
                        }
                      });
                  } else {
                    // If user is authenticated, directly go to checkout
                    router.push(`${homeUrl}${locale}/checkout`);
                  }
                }}
                className="btn btn-primary"
              >
                {getTranslation(
                  translation[0]?.translations,
                  "Proceed to Checkout",
                  locale || 'en'
                )}
              </button>

              {!validUserTocken && (
                <button
                  onClick={handleGuestCheckout}
                  className="btn btn-light btn-large"
                >
                  {getTranslation(
                    translation[0]?.translations,
                    "Continue as a Guest",
                    locale || 'en'
                  )}
                </button>
              )}
              <div className="flex items-center justify-center w-full">
                <PaymentOptions />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
