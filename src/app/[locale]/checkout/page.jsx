"use client";

import { useState, useEffect, useMemo } from "react";
import AmountList from "../Components/AmountList";
import CouponCode from "../Components/CouponCode";
import SectionHeader from "../Components/SectionHeader";
import {
  apiUrl,
  getTranslation,
  homeUrl,
  siteName,
  woocommerceKey,
} from "../Utils/variables";
import PaymentButton from "../Components/PaymentButton";
import PaymentOptionsList from "../Components/PaymentOptionsList";
import withAuth from "../Utils/withAuth";
import { useCartContext } from "../Context/cartContext";
import GuestCheckoutAddressForm from "../Components/Forms/GuestCheckoutAddressForm";
import PageHeader from "../Components/PageHeader";
import Link from "next/link";
import { useCheckoutContext } from "../Context/checkoutContext";
import Swal from "sweetalert2";
import Alerts from "../Components/Alerts";
import AddNewAddressForm from "../Components/Forms/AddNewAddress";
import PaymentOptions from "../Components/PaymentOptions";
import { useAuthContext } from "../Context/authContext";
import { useLanguageContext } from "../Context/LanguageContext";
import LoadingItem from "../Components/LoadingItem";
import { useParams, useRouter } from "next/navigation";
import { userId } from "../Utils/UserInfo";
import { use } from "react";
import Cookies from "js-cookie";
import { useSiteContext } from "../Context/siteContext";

function Checkout() {
  const params = useParams();
  const locale = params.locale;

  const router = useRouter();

  const { guestUser } = useCartContext();

  const { userData } = useAuthContext();

  const { validUserTocken } = useAuthContext();
  const { savedAddress, setSavedAddress } = useSiteContext();

  const {
    setBillingAddress,
    billingAddress,
    validateAddress,
    setValidateAddress,
    showAddNewAddress,
    setShowAddNewAddress,
  } = useCheckoutContext();

  const { translation } = useLanguageContext();

  // State to store the fetched data
  const [paymentOptions, setPaymentOptions] = useState(null);
  const [couponCodes, setCouponCodes] = useState(null);
  const [selectAddressFromList, setSelectAddressFromList] = useState(false);
  const [activeId, setActiveId] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch payment options
        const paymentOptionsResponse = await fetch(
          `${apiUrl}wp-json/wc/v3/payment_gateways${woocommerceKey}`,
          {
            next: { revalidate: 60 },
          }
        );
        const paymentOptionsData = await paymentOptionsResponse.json();
        setPaymentOptions(paymentOptionsData);

        // Fetch coupon codes
        const couponCodeResponse = await fetch(
          `${apiUrl}wp-json/wc/v3/coupons${woocommerceKey}`,
          {
            next: { revalidate: 60 },
          }
        );
        const couponCodeData = await couponCodeResponse.json();
        setCouponCodes(couponCodeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchCustomerData = async () => {
    if (userData?.id) {
      try {
        const addressResponse = await fetch(
          `${apiUrl}wp-json/custom/v1/customer/${userData?.id}/get-addresses`,
          {
            next: { revalidate: 60 },
          }
        );
        const addressResponseData = await addressResponse.json();
        setSavedAddress(addressResponseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCustomerData();

    if (!guestUser && !selectAddressFromList) {
      if (
        userData?.id &&
        Array.isArray(savedAddress) &&
        savedAddress.length > 0
      ) {
        setValidateAddress(true);
        setActiveId(savedAddress[0]?.id);
        setBillingAddress({
          firstName: savedAddress[0]?.full_name,
          lastName: "",
          country: savedAddress[0]?.country,
          houseName: savedAddress[0]?.address_1,
          street: savedAddress[0]?.address_2,
          landmark: savedAddress[0]?.landmark,
          state: savedAddress[0]?.state,
          city: savedAddress[0]?.city,
          pinCode: savedAddress[0]?.pincode,
          phone: savedAddress[0]?.phone,
        });
        setSelectAddressFromList(true);
      } else {
        setValidateAddress(false);
        setBillingAddress("");
      }
    }
  }, [userData?.id, savedAddress, router, activeId]); // Re-run when userId or savedAddress changes

  // State to keep track of the active item

  // Function to handle item click
  const handleClick = (id) => {
    setActiveId(id);
  };

  const handleSelectAddress = (selectedBillingAddress) => {
    setBillingAddress(selectedBillingAddress);
    setValidateAddress(!validateAddress);
    setSelectAddressFromList(true);
  };

  const deleteAddress = (id) => {
    setLoading(true);

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
          locale || "en"
        ),
        text: getTranslation(
          translation[0]?.translations,
          "Do you need to remove this address?",
          locale || "en"
        ),
        icon: false,
        showCancelButton: true,
        confirmButtonText: getTranslation(
          translation[0]?.translations,
          "Yes",
          locale || "en"
        ),
        cancelButtonText: getTranslation(
          translation[0]?.translations,
          "Cancel",
          locale || "en"
        ),
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          fetch(
            `${apiUrl}wp-json/custom/v1/customer/${userData?.id}/delete-address`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                address_id: id,
              }),
            },
            setLoading(false)
          )
            .then((res) => res.json())

            // .then((data) => {
            //   setSavedAddress(data); // Update state with the response data
            // })
            .catch((error) => {
              setLoading(false);
              console.error("Error deleting address:", error);
            });
        }
      });
  };

  return (
    <main className="bg-light lg:bg-white">
      <section className="p-0 lg:pb-10">
        <PageHeader
          title={getTranslation(
            translation[0]?.translations,
            "Checkout",
            locale || "en"
          )}
        />
        <div className="mobile-container-fixed">
          <div className="lg:pt-10 max-w-[999px] mx-auto grid sm:gap-12 gap-5">
            <div className={`lg:justify-between  lg:gap-0 gap-2`}>
              {!showAddNewAddress && (
                <div className="bg-white lg:p-0 p-5 !pb-6 text-center">
                  {!guestUser ? (
                    <>
                      <SectionHeader
                        title={getTranslation(
                          translation[0]?.translations,
                          "Select address",
                          locale || "en"
                        )}
                        card
                      />

                      {loading ? (
                        <LoadingItem spinner />
                      ) : userData?.id &&
                        Array.isArray(savedAddress) &&
                        savedAddress.length > 0 ? (
                        <ul className="grid gap-5">
                          {savedAddress.map((item) => (
                            <li
                              key={item.id}
                              onClick={() => {
                                handleClick(item.id);
                                handleSelectAddress({
                                  firstName: item?.full_name,
                                  lastName: "",
                                  country: item?.country,
                                  houseName: item?.address_1,
                                  street: item?.address_2,
                                  landmark: item?.landmark,
                                  state: item?.state,
                                  city: item?.city,
                                  pinCode: item?.pincode,
                                  phone: item?.phone,
                                });
                              }}
                              className={`${
                                (selectAddressFromList &&
                                  item.id === activeId) ||
                                item.id === activeId
                                  ? "bg-light border-primary"
                                  : "border-border"
                              } border sm:p-7 p-5 text-start cursor-pointer`}
                            >
                              <div className="!grid gap-1 [&>*]:text-base [&>*]:opacity-70 sm:max-w-[60%]">
                                <h4 className="secondary-font text-black font-semibold">
                                  {item?.full_name || "No name available"}
                                </h4>

                                {item?.address_1 && (
                                  <span>{item?.address_1}</span>
                                )}
                                {item?.address_2 && (
                                  <span>{item?.address_2}</span>
                                )}
                                {item?.company && <span>{item?.company}</span>}

                                {(item?.city ||
                                  item?.state ||
                                  item?.country ||
                                  item?.pincode ||
                                  item?.phone) && (
                                  <>
                                    {item?.city && <span>{item?.city}</span>}
                                    {item?.state && item?.city && (
                                      <span>, {item?.state}</span>
                                    )}
                                    {item?.country &&
                                      (item?.city || item?.state) && (
                                        <span>, {item?.country}</span>
                                      )}
                                    {item?.pincode && (
                                      <span>
                                        {getTranslation(
                                          translation[0]?.translations,
                                          "Pin.",
                                          locale || "en"
                                        )}
                                        . {item?.pincode}
                                      </span>
                                    )}
                                    {item?.phone && (
                                      <span>
                                        {getTranslation(
                                          translation[0]?.translations,
                                          "Ph.",
                                          locale || "en"
                                        )}{" "}
                                        {item?.phone}
                                      </span>
                                    )}
                                  </>
                                )}

                                <div>
                                  <div className="join mt-4 !gap-0">
                                    <Link
                                      href={`${homeUrl}${locale}/account/address/edit/${item?.id}`}
                                      className="btn btn-light btn-medium join-item min-w-20 flex justify-center"
                                    >
                                      {getTranslation(
                                        translation[0]?.translations,
                                        "Edit",
                                        locale || "en"
                                      )}
                                    </Link>
                                    <button
                                      className="btn btn-light btn-medium join-item min-w-20 flex justify-center"
                                      onClick={() => deleteAddress(item?.id)}
                                    >
                                      {getTranslation(
                                        translation[0]?.translations,
                                        "Delete",
                                        locale || "en"
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Alerts
                          center
                          status="red"
                          title={getTranslation(
                            translation[0]?.translations,
                            "No address has been saved.",
                            locale || "en"
                          )}
                        />
                        // <LoadingItem spinner />
                      )}
                    </>
                  ) : (
                    <div className="card bg-white grid">
                      <SectionHeader
                        title={getTranslation(
                          translation[0]?.translations,
                          "Add billing details",
                          locale || "en"
                        )}
                        card
                      />
                      <GuestCheckoutAddressForm />
                    </div>
                  )}
                </div>
              )}

              {showAddNewAddress && (
                <div className="grid mt-5 bg-white lg:p-0 p-5 !pb-6 ">
                  <SectionHeader
                    title={getTranslation(
                      translation[0]?.translations,
                      "Add new billing details",
                      locale || "en"
                    )}
                    card
                  />

                  <AddNewAddressForm onAddressAdded={fetchCustomerData} />
                </div>
              )}

              <div className="bg-white lg:p-0 p-5 grid lg:grid-cols-2 sm:gap-7 gap-5 lg:mt-5 lg:border-t border-border lg:!pt-10">
                <div className="w-full">
                  {validUserTocken && (
                    <button
                      className="btn btn-mobile-full"
                      onClick={() => setShowAddNewAddress(!showAddNewAddress)} // Toggle logic corrected
                    >
                      {!showAddNewAddress
                        ? getTranslation(
                            translation[0]?.translations,
                            "Add a new address",
                            locale || "en"
                          )
                        : getTranslation(
                            translation[0]?.translations,
                            "Use saved address",
                            locale || "en"
                          )}
                    </button>
                  )}
                </div>
                <div>
                  <div className="grid gap-5">
                    <CouponCode data={couponCodes && couponCodes} />
                    <div className="pb-4">
                      <AmountList />
                    </div>
                    <div className="grid gap-2">
                      {paymentOptions && (
                        <PaymentOptionsList data={paymentOptions} />
                      )}
                    </div>
                    <PaymentButton locale={locale} />
                    <div className="flex items-center justify-center w-full">
                      <PaymentOptions />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default withAuth(Checkout);
//export default Checkout;
