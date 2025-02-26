"use client";
import { useState, useEffect, useRef } from "react";
import AmountList from "./AmountList";

export default function TableView({ data, labels }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        // Skeleton Loader
        <div className="skeleton h-32 w-full mb-5"></div>
      ) : (
        <li className="card-rounded-none-small bg-white mb-3">
          <div className="w-full">
            <AmountList
              data={data && data}
              labels={labels && labels}
              tableView
            />
          </div>
        </li>
      )}
    </>
  );
}
