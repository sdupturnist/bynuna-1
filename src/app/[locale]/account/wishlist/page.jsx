"use client";

import { useEffect, useState } from "react";
import Alerts from "../../Components/Alerts";
import Card from "../../Components/Card";
import LoadingItem from "../../Components/LoadingItem";
import { useSiteContext } from "../../Context/siteContext";
import { useParams } from "next/navigation";
import { useLanguageContext } from "../../Context/LanguageContext";

export default function WishList() {
  const params = useParams();
  const locale = params.locale;

  const { activeWishlist } = useSiteContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeWishlist) {
      setLoading(false);
    }
  }, [activeWishlist]);

  console.log(activeWishlist)

  return (
    <div className="bg-bggray">
      <section className="pb-0 sm:pt-0 pt-3">
        <div className="sm:bg-transparent max-w-[999px] mx-auto">
          <div>
            <>
              {loading ? (
                <LoadingItem spinner />
              ) : activeWishlist && activeWishlist?.length === 0 ? (
                <Alerts
                  status="red"
                  noPageUrl
                  title="No wishlist data available"
                />
              ) : (
                <ul className="grid gap-5">
                  <div className="grid gap-3 sm:gap-0 w-full lg:order-2 order-first">
                    <div className="section-header-card">
                      <div className="wish-list">
                        {/* Render based on your condition */}
                        {activeWishlist &&
                          activeWishlist.map((item, index) => (
                            <Card
                              product
                              key={index}
                              data={item}
                              locale={locale}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </ul>
              )}
            </>
          </div>
        </div>
      </section>
    </div>
  );
}
