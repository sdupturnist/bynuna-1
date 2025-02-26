"use client";


import { useParams, useRouter } from "next/navigation";
import { useLanguageContext } from "../Context/LanguageContext";
import { formatDateString, getTranslation, siteName } from "../Utils/variables";

export default function BlogInfo({ postDate, }) {

    const router = useRouter();
       const params = useParams();  
       const locale = params.locale; 

  const { translation } = useLanguageContext();

  return (
    <div>
      <p className="opacity-50 text-sm">
        {getTranslation(translation[0]?.translations, "Admin", locale || 'en')}
        <span className="text-sm mx-1 opacity-50">|</span>{" "}
        {formatDateString(postDate)}
      </p>
    </div>
  );
}
