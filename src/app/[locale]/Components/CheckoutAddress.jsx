"use client";
import { useEffect, useMemo, useState } from "react";
import SectionHeader from "./SectionHeader";
import ListOptionsAddress from "./AllAddress";
import AddNewAddressForm from "./Forms/AddNewAddress";
import Alerts from "./Alerts";
import { apiUrl, woocommerceKey } from "../Utils/variables";
import Skelton from "./Skelton";
import { useCheckoutContext } from "../Context/checkoutContext";
import { useAuthContext } from "../Context/authContext";

export default function CheckoutAddress() {
  const { userData } = useAuthContext();

  const { showAddNewAddress, setShowAddNewAddress } = useCheckoutContext();

  const [savedAddress, setAdditionalsavedAddress] = useState("");

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch(`${apiUrl}wp-json/wc/v3/customers/${userData?.id}${woocommerceKey}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setAdditionalsavedAddress(data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     });
  // }, [savedAddress]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wc/v3/customers/${userData?.id}${woocommerceKey}`
      );
      const data = await response.json();
      setAdditionalsavedAddress(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [savedAddress]);

  const additionalAddresses = useMemo(() => {
    return savedAddress?.meta_data?.find(
      (item) => item.key === "additional_addresses"
    )?.value;
  }, [savedAddress?.meta_data]);

  return (
    <div className={`card-rounded-none-small w-full bg-white py-5`}>
      {!showAddNewAddress && (
        <>
          <SectionHeader title="Billing details" card />
          <ul className="grid gap-5">
            {!loading &&
              !showAddNewAddress &&
              (savedAddress && additionalAddresses?.length > 0 ? null : (
                <Alerts status="red" title="No address has been saved." />
              ))}

            {loading ? (
              <Skelton listAddress />
            ) : (
              additionalAddresses &&
              !additionalAddresses && (
                <>
                  <ListOptionsAddress
                    data={additionalAddresses && additionalAddresses?.billing}
                    title={`${
                      additionalAddresses && additionalAddresses?.full_name
                    }, ${
                      additionalAddresses && additionalAddresses?.last_name
                    }`}
                    titleBold
                  />
                </>
              )
            )}

            {loading ? (
              <Skelton listAddress />
            ) : [additionalAddresses]?.length < 1 ? (
              !showAddNewAddress && (
                <ListOptionsAddress
                  data={additionalAddresses?.billing}
                  title={`${additionalAddresses?.full_name}, ${additionalAddresses?.last_name}`}
                  titleBold
                />
              )
            ) : (
              additionalAddresses &&
              additionalAddresses.map(
                (item, index) =>
                  !showAddNewAddress && (
                    <ListOptionsAddress
                      key={index}
                      data={item}
                      title={`${item && item?.full_name}, ${
                        item && item?.last_name
                      }`}
                      titleBold
                    />
                  )
              )
            )}
          </ul>
        </>
      )}

      {showAddNewAddress && (
        <div className="grid mt-5">
          <SectionHeader title="Add new billing details" card />

          <AddNewAddressForm
            onAddressAdded={fetchData}
            addressCount={additionalAddresses ? additionalAddresses?.length : 0}
          />
        </div>
      )}
    </div>
  );
}
