"use client";


import { useEffect, useState } from "react";
import { apiUrl, siteName, woocommerceKey } from "../../Utils/variables";
import Alerts from "../../Components/Alerts";
import Card from "../../Components/Card";
import LoadingItem from "../../Components/LoadingItem";
import { useSiteContext } from "../../Context/siteContext";
import { useParams } from "next/navigation";

export default function WishList() {

  const params = useParams();  
  const locale = params.locale; 


  const { activeWishlist } = useSiteContext();
  const wishlistItems =
    JSON.parse(sessionStorage.getItem(`${siteName}_wishlist_data`)) ||
    activeWishlist;

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  // Construct the query string for the wishlist items
  const result = Array.isArray(wishlistItems)
    ? wishlistItems.map((id) => `&include[]=${id}`).join("")
    : wishlistItems && typeof wishlistItems === "object"
    ? Object.values(wishlistItems)
        .map((value) => `&include[]=${value}`)
        .join("")
    : "";

  // Fetch product data based on wishlist
  useEffect(() => {
    if (result) {
      setLoading(true);
      setError(null); // Reset previous errors

      fetch(`${apiUrl}wp-json/wc/v3/products${woocommerceKey}${result}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch wishlist items");
          }
          return res.json();
        })
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message); // Set error message
          setLoading(false);
        });
    } else {
      setLoading(false); // If there's no wishlist data, stop loading
    }
  }, [result]);



  // Conditional Rendering
  if (!wishlistItems) {
    return (
      <div className="bg-bggray">
        <section className="pb-0 sm:pt-0 pt-3">
          <div className="sm:bg-transparent max-w-[999px] mx-auto">
            <Alerts status="red" noPageUrl title="No wishlist data available" />
          </div>
        </section>
      </div>
    );
  }




  return (
    <div className="bg-bggray">
      <section className="pb-0 sm:pt-0 pt-3">
        <div className="sm:bg-transparent max-w-[999px] mx-auto">
          <div>
            {loading ? (
              // Display Loading Component while loading is true
              <div className="flex items-center justify-center w-full h-[50vh]">
                <LoadingItem spinner />
              </div>
            ) : error ? (
              // Show error if fetching fails
              <Alerts status="red" noPageUrl title={error} />
            ) : items.length === 0 ? (
              // Show message if wishlist is empty
              <div className="grid gap-3 sm:gap-0 w-full lg:order-2 order-first">
                <div className="section-header-card">
                  <Alerts
                    status="red"
                    noPageUrl
                    title="You have not any products in your wishlist"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-3 sm:gap-0 w-full lg:order-2 order-first">
                  <div className="section-header-card">
                  <div className="wish-list">
                          {items.length > 0 &&
                            items &&
                            items?.map((item, index) => (
                              <Card product key={index} data={item} locale={locale}/>
                            ))}
                        </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
