"use client";

import Card from "../../Components/Card";
import Loading from "../../Components/LoadingItem";
import { apiUrl } from "../../Utils/variables";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../Context/authContext";
import Alerts from "../../Components/Alerts";



export default function MyReviews() {
  const { userData } = useAuthContext();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    fetch(`${apiUrl}wp-json/custom/v1/product-reviews`)
      .then((res) => res.json())
      .then((data) => {
        const filteredReviews = data.filter(
          (review) => review.reviewer_email === userData?.email
        );

        setReviews(filteredReviews);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [reviews, userData?.email]);

  return loading ? (
    <div className="flex items-center justify-center sm:min-h-[70vh] min-h-[50vh]">
      <Loading spinner />
    </div>
  ) : (
    <div className="bg-bggray">
   
      <section className="pb-0 sm:pt-0 pt-3">
        <div className="sm:bg-transparent max-w-[999px] mx-auto grid sm:gap-6 gap-3">
          {!reviews?.length > 0 && (
            <Alerts status="red" noPageUrl title="You have no reviews" />
          )}
          <ul className="review-list px-5 sm:px-0">
            {reviews &&
              reviews.map((item, index) => (
                <Card key={index} review data={item} account />
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
