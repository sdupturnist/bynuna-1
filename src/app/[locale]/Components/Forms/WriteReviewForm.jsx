"use client";

import {
  apiUrl,
  getTranslation,
  homeUrl,
  siteEmail,
  siteName,
  woocommerceKey,
} from "../../Utils/variables";
import { useState } from "react";

import { sendMail } from "../../Utils/Mail";
import { useAuthContext } from "../../Context/authContext";
import { useRouter } from "nextjs-toploader/app";
import { useJwt } from "../../Context/jwtContext";
import { useLanguageContext } from "../../Context/LanguageContext";
import Alerts from "../Alerts";
import FloatingLabelInput from "../FloatingLabelInput";
import LoadingItem from "../LoadingItem";
import { useParams } from "next/navigation";


export default function WriteReviewForm({ productId}) {
  const { validUserTocken, userData } = useAuthContext();

  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState();

  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const { translation } = useLanguageContext();

  const { token } = useJwt();

  //const modalElement = document.getElementById("modal_all");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validUserTocken) {
      router.push(`${homeUrl}${locale}/auth/login`);
      return false;
    }

    setLoading(true);

    const requestData = {
      review: review,
      rating: rating,
      name: userData?.first_name,
      email: userData?.email,
      status: "hold",
    };

    try {
      // Submit the review
      const response = await fetch(
        `${apiUrl}wp-json/wc/v3/products/reviews${woocommerceKey}&product_id=${productId}&reviewer=${userData.first_name}&reviewer_email=${userData.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        setLoading(false);
        setStatus(true);

        setTimeout(() => {
          setStatus(false);
          setReview("");
        }, 3000);

        //MAIL NOTIFICATION TO ADMIN
        await sendMail({
          sendTo: siteEmail,
          name: "Admin",
          subject: "Review",
          message: `You have received a new review from ${siteName}`,
        });

        //MAIL NOTIFICATION TO REVIEWER
        await sendMail({
          sendTo: userData?.email,
          name: userData?.first_name || userData?.username || "",
          subject: `Thank You for Sharing Your Feedback! | ${siteName}`,
          message: `Your review will be reviewed by the admin, and if approved, it will be published soon.`,
        });
      } else {
        const errorResponse = await response.json();
        console.error("Failed to submit review", response.status);
        setErrorMessage(errorResponse?.message);
        setError(true);
        setLoading(false);
        setStatus(false);

        setTimeout(() => {
          setErrorMessage("");
          setError(false);
        }, 3000);
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error);
      setLoading(false);
      setStatus(false);

      setTimeout(() => {
        setErrorMessage("");
        setError(false);
      }, 3000);

      console.error("An error occurred:", error);
    } finally {
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid sm:gap-5 gap-1">
        <div>
          {status && (
            <Alerts
              status="green"
              title={getTranslation(
                translation[0]?.translations,
                "Your review has been submitted for approval. Thank you for your feedback.",
                locale || 'en'
              )}
            />
          )}
          {error && (
            <Alerts
              status="red"
              title={getTranslation(
                translation[0]?.translations,
                errorMessage,
                locale || 'en'
              )}
            />
          )}
        </div>
        <div className="grid gap-4">
          <small className="text-center text-black text-sm font-normal leading-normal">
            {getTranslation(
              translation[0]?.translations,
              "How Would You Rate This?",
              locale || 'en'
            )}
          </small>

          <div className="rating sm:rating-lg rating-md mb-3 flex sm:gap-4 gap-2 items-center justify-center">
            <input
              required
              type="radio"
              name="rating-review"
              value="1"
              onChange={(e) => setRating(e.target.value)}
              className="mask mask-star-2 bg-primary"
            />
            <input
              required
              type="radio"
              name="rating-review"
              value="2"
              onChange={(e) => setRating(e.target.value)}
              className="mask mask-star-2 bg-primary"
            />
            <input
              required
              type="radio"
              name="rating-review"
              value="3"
              onChange={(e) => setRating(e.target.value)}
              className="mask mask-star-2 bg-primary"
            />
            <input
              required
              type="radio"
              name="rating-review"
              value="4"
              onChange={(e) => setRating(e.target.value)}
              className="mask mask-star-2 bg-primary"
            />
            <input
              required
              type="radio"
              name="rating-review"
              value="5"
              onChange={(e) => setRating(e.target.value)}
              className="mask mask-star-2 bg-primary"
              defaultChecked
            />
          </div>
          <FloatingLabelInput
            required={true}
            textarea
            name=""
            id=""
            className="input h-[100px]"
            label={getTranslation(
              translation[0]?.translations,
              "Write a review",
              locale || 'en'
            )}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="10"
          />

          <button className="btn btn-large w-full" type="submit">
            {loading && <LoadingItem/>}
            {getTranslation(translation[0]?.translations, "Submit", locale || 'en')}
          </button>
        </div>
      </div>
    </form>
  );
}
