"use client";

import { StarIcon } from "@heroicons/react/24/solid";

export default function ReviewCount({ average, ratingCount, large }) {
  const roundedValue = Math.round(average * 10) / 10;

  // Create a function to render stars based on average rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 >= 0.5; // Check if there should be a half star
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Empty stars to fill up to 5

    // Push full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className={`bi bi-star-fill text-primary  ${large && 'text-[24px]'}`}></i>
      );
    }

    // Push half star if necessary
    if (hasHalfStar) {
      stars.push(
        <i key="half" className={`bi bi-star-half text-primary  ${large && 'text-[24px]'}`}></i>
      );
    }

    // Push empty stars to fill the row
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className={`bi bi-star-fill text-gray-300  ${large && 'text-[24px]'}`}></i>
      );
    }

    return stars;
  };

  return !large ? (
    <small className="flex items-center justify-start lg:justify-start gap-[3px] lg:mb-2 absolute sm:top-[15px] sm:left-[15px] top-0 left-[5px] text-body">
       <i className={`bi bi-star-fill text-primary`}></i><span className="pt-[1px]">{average && average}</span>
    </small>
  ) : (
    <small className="flex items-center text-body  gap-[7]">
      {renderStars(roundedValue)}
      <span className="block text-base leading-none pt-1 pl-1">
        {average && average}
      </span>
      {/* <span className="block opacity-50 text-[15px] leading-none">
        ({ratingCount && ratingCount} Review
        {ratingCount && ratingCount > 1 && "s"})
      </span> */}
    </small>
  );
}
