"use client";

import { useState } from "react";
import { useSiteContext } from "../Context/siteContext";
import Card from "./Card";
import { useEffect } from "react";
import Skelton from "./Skelton";
import LoadingItem from "./LoadingItem";

export default function CategorySlider({ data, locale }) {



  const { mainCatMenues } = useSiteContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mainCatMenues?.items) {
      setLoading(false);
    }
  }, [mainCatMenues]);

  return loading ? (
    <>
      <div className="hidden lg:block">
        <Skelton boxes />
      </div>
      <div className="lg:hidden flex items-center justify-center min-h-[20vh] w-full">
        <LoadingItem dot />
      </div>
    </>
  ) : (
    <ul className="main-cat-list w-full">
      {mainCatMenues?.items &&
        mainCatMenues?.items.map((item, index) => (
          <Card
            locale={locale}
            key={index}
            data={item}
            type="category"
            title={
              locale  === "en"
                ? item?.title?.rendered || item?.title
                : item?.acf?.arabic
            }
          />
        ))}
    </ul>
  );
}
