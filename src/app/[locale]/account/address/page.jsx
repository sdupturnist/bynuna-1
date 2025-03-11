"use client";

import { useEffect, useState } from "react";
import {
  apiUrl,
  getTranslation,
  homeUrl,
} from "../../Utils/variables";
import Loading from "../../Components/LoadingItem";
import Swal from "sweetalert2";
import { useSiteContext } from "../../Context/siteContext";
import Link from "next/link";
import { useAuthContext } from "../../Context/authContext";
import AddNewAddress from "../../Components/AddNewAddress";
import Alerts from "../../Components/Alerts";
import { useLanguageContext } from "../../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";

export default function Address() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { userData } = useAuthContext();
 // const [savedAddress, setSavedAddress ] = useState([]);
  

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { translation } = useLanguageContext();
  const { setEditData, savedAddress, setSavedAddress  } = useSiteContext();
 



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
   
  }, [userData?.id, savedAddress, router]); 

  // Handle address deletion
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
          locale || "en"
        ),

        text: getTranslation(
          translation[0]?.translations,
          `Do you need to remove this address?`,
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
          setLoading(true);
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
            }
          )
            .then((res) => res.json())
            .then(() => {
              // Re-fetch addresses after deletion
              fetchCustomerData(); // This should ensure the latest data is fetched.
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error deleting address:", error);
              setError("Failed to delete address. Please try again.");
            });
        } else {
          setLoading(false);
        }
      });
  };

  return loading ? (
    <div className="flex items-center justify-center sm:min-h-[70vh] min-h-[50vh]">
      <Loading spinner />
    </div>
  ) : error ? (
    <div className="flex items-center justify-center sm:min-h-[70vh] min-h-[50vh]">
      <Alerts title={error} />
    </div>
  ) : (
    <div className="bg-bggray">
      <section className="pb-0 sm:pt-0 pt-3">
        <div className="sm:bg-transparent max-w-[999px] mx-auto grid sm:gap-6 gap-3">
          {loading ? (
            <LoadingItem spinner />
          ) : userData?.id &&
            Array.isArray(savedAddress) &&
            savedAddress.length > 0 ? (
            <ul className="grid gap-5">
              {savedAddress &&
                savedAddress?.length !== 0 &&
                userData?.id &&
                savedAddress.map((item, index) => (
                  <div
                    key={index}
                    className="border border-border p-7 relative"
                  >
                    <div className="pb-2">
                      <div className="dropdown dropdown-end absolute manage-address top-5">
                        <div tabIndex={0} role="button">
                          <i className="bi bi-three-dots"></i>
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                        >
                          <li>
                            <Link
                             onTouchStart={(e) => setEditData(item)}
                              onClick={(e) => setEditData(item)}
                              href={`${homeUrl}${locale}/account/address/edit/${item?.id}`}
                            >
                              {getTranslation(
                                translation[0]?.translations,
                                "Edit",
                                locale || "en"
                              )}
                            </Link>
                          </li>
                          <li>
                            <button 
                              onTouchStart={(e) => deleteAddress(item?.id)}
                            onClick={(e) => deleteAddress(item?.id)}
                            >
                              {getTranslation(
                                translation[0]?.translations,
                                "Delete",
                                locale || "en"
                              )}
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="flex gap-3 mb-2">
                        <label className="font-semibold">
                          {item?.full_name} {item?.last_name}
                        </label>
                      </div>

                      <div className="!grid gap-1 [&>*]:text-base [&>*]:opacity-70 sm:max-w-[60%]">
                        {item?.address_1 && <span>{item?.address_1}</span>}
                        {item?.company && <span>{item?.company}</span>}
                        {item?.city && (
                          <>
                            {item?.city && <span>{item?.city}, </span>}
                            {item?.state && <span>{item?.state}, </span>}
                            {item?.country && <span>{item?.country}, </span>}
                            {item?.pincode && <span>Pin. {item?.pincode}</span>}

                            {item?.phone && <span>Ph. {item?.phone}</span>}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
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
          )}
          <AddNewAddress onAddressAdded={savedAddress} />
        </div>
      </section>
    </div>
  );
}
