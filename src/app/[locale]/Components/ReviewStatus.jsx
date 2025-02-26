"use client";

export default function ReviewStatus({ reviews }) {
  // Calculate the total sum of ratings and the count of ratings per star
  let totalRating = 0;
  let reviewCount = reviews.length;

  const ratings = {
    "5": 0,
    "4": 0,
    "3": 0,
    "2": 0,
    "1": 0,
  };

  // Loop through reviews to calculate the sum of ratings and count per star
  reviews.forEach((review) => {
    totalRating += review.rating;
    if (review.rating === 5) ratings["5"] += 1;
    if (review.rating === 4) ratings["4"] += 1;
    if (review.rating === 3) ratings["3"] += 1;
    if (review.rating === 2) ratings["2"] += 1;
    if (review.rating === 1) ratings["1"] += 1;
  });

  // Calculate the average rating
  let averageRating = totalRating / reviewCount;

  // Round to 1 decimal place
  let roundedAverage = Math.round(averageRating * 10) / 10;

  const StarRating = ({ rating }) => {
    // Determine the number of full stars, half stars, and empty stars
    const fullStars = Math.floor(rating); // Whole number of stars (e.g., 4)
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Check if there's a half star
    const emptyStars = 5 - fullStars - halfStars; // Remaining empty stars

    return (
      <div className="flex gap-1">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <i
            key={`full-${index}`}
            className="bi bi-star-fill text-primary text-xl"
          ></i>
        ))}

        {/* Half star */}
        {halfStars > 0 && (
          <i className="bi bi-star-half text-primary text-xl"></i>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <i
            key={`empty-${index}`}
            className="bi bi-star text-gray-300 text-xl"
          ></i>
        ))}
      </div>
    );
  };

  // Calculate the total number of ratings
  const totalRatings = ratings["5"] + ratings["4"] + ratings["3"] + ratings["2"] + ratings["1"];

  // Get the progress bar value for each star count
  const getProgressValue = (starCount) => {
    return (ratings[starCount] / totalRatings) * 100;
  };

  return (
    <div className="md:max-w-[400px] mx-w-full bg-white border border-border mb-3 p-4">
      <span className="text-black block !text-[28px] font-semibold leading-">
        {roundedAverage.toFixed(2)}
      </span>
      <StarRating rating={roundedAverage} />
      <div className="opacity-50 text-black text-xs font-medium mt-2">
        ({reviewCount} Reviews)
      </div>

      <div className="text-black [&>*]:!text-xs font-normal mt-4 grid gap-2">
        {/* 5 stars */}
        <div className="flex items-center justify-between gap-2">
          <small className="flex whitespace-nowrap min-w-[40px] text-xs">
            5 stars
          </small>
          <progress
            className="progress progress-primary w-full bg-gray-100 rounded-none h-[5px]"
            value={getProgressValue(5)}
            max="100"
          ></progress>
          <small>{ratings["5"]}</small>
        </div>
        
        {/* 4 stars */}
        <div className="flex items-center justify-between gap-2">
          <small className="flex whitespace-nowrap min-w-[40px] text-xs">
            4 stars
          </small>
          <progress
            className="progress progress-primary w-full bg-gray-100 rounded-none h-[5px]"
            value={getProgressValue(4)}
            max="100"
          ></progress>
          <small>{ratings["4"]}</small>
        </div>

        {/* 3 stars */}
        <div className="flex items-center justify-between gap-2">
          <small className="flex whitespace-nowrap min-w-[40px] text-xs">
            3 stars
          </small>
          <progress
            className="progress progress-primary w-full bg-gray-100 rounded-none h-[5px]"
            value={getProgressValue(3)}
            max="100"
          ></progress>
          <small>{ratings["3"]}</small>
        </div>

        {/* 2 stars */}
        <div className="flex items-center justify-between gap-2">
          <small className="flex whitespace-nowrap min-w-[40px] text-xs">
            2 stars
          </small>
          <progress
            className="progress progress-primary w-full bg-gray-100 rounded-none h-[5px]"
            value={getProgressValue(2)}
            max="100"
          ></progress>
          <small>{ratings["2"]}</small>
        </div>

        {/* 1 star */}
        <div className="flex items-center justify-between gap-2">
          <small className="flex whitespace-nowrap min-w-[40px] text-xs">
            1 star
          </small>
          <progress
            className="progress progress-primary w-full bg-gray-100 rounded-none h-[5px]"
            value={getProgressValue(1)}
            max="100"
          ></progress>
          <small>{ratings["1"]}</small>
        </div>
      </div>
    </div>
  );
}
