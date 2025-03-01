"use client";

import { useAuthContext } from "../Context/authContext";
import { isLoggined } from "../Utils/checkAuth";
import WriteReviewForm from "./Forms/WriteReviewForm";
import ModalPopup from "./ModalPopup";
import { useRouter } from 'nextjs-toploader/app';
import { getTranslation, siteName } from "../Utils/variables";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams } from "next/navigation";


export default function WriteReview({ productId,  }) {

  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 

  const { auth } = useAuthContext(); // Get authentication status

    
      const { translation } = useLanguageContext();

  const openReviewForm = () => {
    !auth
      ? isLoggined(
          auth,
          router,
          null,
          "Log in to Write a Review",
          "Please log in to your account to share your feedback and write a review",
          params
        )
      : document.getElementById("modal_all").showModal();
  };

  return (
    <>
      <button className="btn btn-medium btn-light" onClick={openReviewForm}>
        { getTranslation(translation[0]?.translations, "Write A Review", locale || 'en')}
      </button>

      <ModalPopup
        noButton
        title="Ratings & Review"
        item={<WriteReviewForm productId={productId} />}
      />
    </>
  );
}
