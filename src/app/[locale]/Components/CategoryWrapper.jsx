"use client";

import { useEffect, useState } from "react";
import { useSiteContext } from "../Context/siteContext";
import Card from "./Card";
import LoadingItem from "./LoadingItem";

export default function CategoryWrapper({ data }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [data]);

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingItem spinner />
        </div>
      )}
      <div className="grid sm:grid-cols-3 grid-cols-2 sm:gap-10 gap-3">
        {!loading &&
          data?.length > 0 &&
          data.map((item, index) => (
            <Card key={index} data={item} categoryLarge />
          ))}
      </div>
    </>
  );
}
