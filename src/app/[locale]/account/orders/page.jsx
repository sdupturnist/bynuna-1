"use client";

import { useEffect, useState } from "react";
import { apiUrl, woocommerceKey } from "../../Utils/variables";
import { useAuthContext } from "../../Context/authContext";
import MyOrder from "../../Components/MyOrder";
import Alerts from "../../Components/Alerts";
import LoadingItem from "../../Components/LoadingItem";

export default function Orders() {
  const { userData } = useAuthContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run once on mount
    fetch(
      `${apiUrl}wp-json/wc/v3/orders${woocommerceKey}&customer=${userData?.id}&per_page=100`
    )
      .then((res) => res.json())
      .then((data) => {
        // Ensure that data is an array before setting it to orders
        setOrders(Array.isArray(data) ? data : []);
        
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        setOrders([]); // Set orders to an empty array in case of an error
      });
  }, [userData]); // Re-run the effect if userData.id changes

  useEffect(() => {
    if (orders.length !== 0) {
      setLoading(false);
    }
  }, [orders]);

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center sm:min-h-[50vh] min-h-[50vh]">
          <LoadingItem spinner />
        </div>
      )}

      {!loading && orders?.length !== 0 ? (
        <>
          <ul className="general-list">
            {orders &&
              orders.map((item, index) => (
                <MyOrder data={item} key={index} userInfo={userData} />
              ))}
          </ul>
        </>
      ) : (
        !loading && <Alerts status="red" noPageUrl title="You have no orders" />
      )}
    </div>
  );
}
