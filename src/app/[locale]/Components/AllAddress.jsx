"use client";

import { useMemo, useState } from "react";
import {
  apiUrl,
  getTranslation,
  homeUrl,
  woocommerceKey,
} from "../Utils/variables";
import Swal from "sweetalert2";
import Link from "next/link";
import { useCheckoutContext } from "../Context/checkoutContext";
import { useAuthContext } from "../Context/authContext";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";

export default function AllAddress({
  
}) {

    const router = useRouter();
     const params = useParams();  
     const locale = params.locale; 

  const { userData } = useAuthContext();

  const {
    setBillingAddress,
    validateAddress,
    setValidateAddress,
    savedAddress,
    setAdditionalsavedAddress,
  } = useCheckoutContext();

  const additionalAddresses = useMemo(() => {
    return savedAddress[0]?.meta_data?.find(
      (item) => item.key === "additional_addresses"
    )?.value;
  }, [savedAddress[0]?.meta_data]);

  // State to keep track of the active item
  const [activeId, setActiveId] = useState(null);

 
  const { translation } = useLanguageContext();

  // Function to handle item click
  const handleClick = (id) => {
    setActiveId(id);
  };

  const handleSelectAddress = (selectedBillingAddress) => {
    setBillingAddress(selectedBillingAddress);
    setValidateAddress(!validateAddress);
  };

  const handleEditClick = () => {
    setEditData(savedAddress); // Update the state before navigating
  };

  const deleteAddress = (id) => {
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
          "Do you need to remove this address?",
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
          fetch(
            `${apiUrl}wp-json/wc/v3/customers/${
              userData && userData?.id
            }/addresses/${id}${woocommerceKey}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((res) => res.json())
            .then((data) => {
              setAdditionalsavedAddress(data);
            })
            .catch((error) => {
              console.error("Error deleting address:", error);
            });
        }
      });
  };

  return (
    <ul className="grid gap-5">
      {savedAddress &&
        additionalAddresses?.map((item) => (
          <li
            key={item.id}
            onClick={() => {
              handleClick(item.id),
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
              item.id === activeId ? "bg-light border-primary" : "border-border"
            } border sm:p-7 p-5 text-start cursor-pointer`}
          >
            <div
              className={`!grid gap-1 [&>*]:text-base [&>*]:opacity-70 sm:max-w-[60%]`}
            >
              <h4 className="secondary-font text-black font-semibold">
                {item?.full_name && item?.full_name}
              </h4>
              {item?.address_1 && <span>{item?.address_1}</span>}
              {item?.address_2 && <span>{item?.address_2}</span>}
              {item?.company && <span>{item?.company}</span>}
              {item?.city && (
                <>
                  {item?.city && <span>{item?.city}, </span>}
                  {item?.state && <span>{item?.state}, </span>}
                  {item?.country && <span>{item?.country}, </span>}

                  {item?.pincode && (
                    <span>
                      {getTranslation(
                        translation[0]?.translations,
                        "Pin.",
                        locale || 'en'
                      )}{" "}
                      {item?.pincode}
                    </span>
                  )}

                  {item?.phone && (
                    <span>
                      {getTranslation(
                        translation[0]?.translations,
                        "Ph.",
                        locale || 'en'
                      )}{" "}
                      {item?.phone}
                    </span>
                  )}
                </>
              )}

              <div>
                <div className="join mt-4 !gap-0">
                  <Link
                    onClick={handleEditClick} // Call the handler here, not directly setting state
                    href={`${homeUrl}${locale}/account/address/edit/${savedAddress?.id}`}
                    className="btn btn-light btn-medium join-item min-w-20 flex justify-center"
                  >
                    {getTranslation(
                      translation[0]?.translations,
                      "Edit ",
                      locale || 'en'
                    )}
                  </Link>
                  <button
                    className="btn btn-light btn-medium join-item min-w-20 flex justify-center"
                    onClick={() => deleteAddress(item.id)}
                  >
                    {getTranslation(
                      translation[0]?.translations,
                      "Delete",
                      locale || 'en'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
}
