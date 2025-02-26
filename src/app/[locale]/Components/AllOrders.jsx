"use client";

import { useEffect, useState } from "react";
import { apiUrl, woocommerceKey } from "../Utils/variables";
import MyOrder from "./MyOrder";
import Alerts from "./Alerts";
import Loading from "./LoadingItem";
import { useAuthContext } from "../Context/authContext";
import { useParams } from "next/navigation";

export default function AllOrders() {

    const router = useRouter();
       const params = useParams();  
       const locale = params.locale; 

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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        setOrders([]); // Set orders to an empty array in case of an error
      });
  }, [userData?.id]); // Re-run the effect if userData.id changes

  return (
    <div>
      {loading ? (
        <div className="text-center min-h-[70vh] flex items-center justify-center">
          <Loading spinner />
        </div>
      ) : (
        <ul className="grid gap-3">
          {userData && Array.isArray(orders) && orders.length > 0
            ? orders.map((item, index) => (
                <MyOrder data={item} key={index} userInfo={userData} />
              ))
            : orders &&
              loading && (
                <Alerts
                  status="red"
                  noPageUrl
                  title= "You have no orders"
                />
              )}
        </ul>
      )}
    </div>
  );
}
