"use client";

import { formatDateString } from "../Utils/variables";
import ReadMore from "./ReadMore";
import Avatar from "./Avatar";

export default function Reviews({ data, account }) {
  // Function to render stars based on review count
  const renderStars = (count) => {
    const stars = [];
    const totalStars = 5; // Assuming a maximum of 5 stars for the review rating

    // Render filled stars (yellow)
    for (let i = 0; i < count; i++) {
      stars.push(
        <i
          key={`full-${i}`}
          className={`bi bi-star-fill text-primary text-lg`}
        ></i>
      );
    }

    // Render empty stars
    for (let i = count; i < totalStars; i++) {
      stars.push(
        <i key={`full-${i}`} className={`bi bi-star text-gray-200 text-lg`}></i>
      );
    }

    return stars;
  };

  return (
    <ul className="review-list">
      {data &&
        data.map((item, index) => (
          <li key={index} className="bg-white">
            <div className="grid">
              <small className="text-black/50 text-xs font-normal leading-tight mb-3 block">
                {item?.date_created && formatDateString(item?.date_created)}
              </small>
              <div className="flex gap-1">{renderStars(item?.rating)}</div>
              <small>
                {account && (
                  <div className="justify-start items-center gap-3 inline-flex mt-4">
                    <Avatar
                      url={item?.reviewer_avatar_urls || ""}
                      reviewer={item?.reviewer}
                    />
                    <div className="grow shrink basis-0 text-black text-sm font-medium leading-[18px]">
                      {item?.reviewer}
                    </div>
                  </div>
                )}
                <div className="justify-start items-center gap-3 inline-flex mt-4">
                  <Avatar
                    url={item?.reviewer_avatar_urls || ""}
                    reviewer={item?.reviewer}
                  />
                  <div className="grow shrink basis-0 text-black text-sm font-medium leading-[18px] capitalize">
                    {item?.reviewer}
                  </div>
                </div>
              </small>
            </div>
            <div className="[&>*]:leading-relaxed  mt-2">
              <ReadMore maxLength="30" children={item?.review} />
            </div>
          </li>
        ))}
    </ul>
  );
}
