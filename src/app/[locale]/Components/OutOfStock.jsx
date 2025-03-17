"use client";

import { useParams } from "next/navigation";
import { useLanguageContext } from "../Context/LanguageContext";
import { getTranslation } from "../Utils/variables";

export default function OutOfStock({ status, single }) {
  const params = useParams();
  const locale = params.locale;

  const { translation } = useLanguageContext();

  return(status === "outofstock" ? (
    
    single ?
    <span className="out-of-stock-single">
    {getTranslation(
      translation[0]?.translations,
      "Out of stock",
      locale || "en"
    )}
  </span>
  :
   <span className="out-of-stock">
      {getTranslation(
        translation[0]?.translations,
        "Out of stock",
        locale || "en"
      )}
    </span>




  ) : null
)
}
