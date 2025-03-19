"use client";
import { useEffect, useState, useRef } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { getTranslation, homeUrl } from "../Utils/variables";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";
import { useSiteContext } from "../Context/siteContext";

export default function Search({}) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { searchMobileVisible, setSearchMobileVisible } = useSiteContext();
  const { translation } = useLanguageContext();

  const [searchVal, setSearchVal] = useState("");

  return (
    <div className="search w-full overflow-hidden border-t border-border">
      <input
        type="text"
        className="join-item input px-5"
        placeholder={getTranslation(
          translation[0]?.translations,
          "Search...",
          locale || "en"
        )}
        onChange={(e) => setSearchVal(e.target.value)}
        value={searchVal}
      />
      <button
        className="btn join-item btn-primary !border-none"
        onClick={(e) => {
          setSearchMobileVisible(!searchMobileVisible),
            router.push(
              `${homeUrl}${locale}/products/search?search=${searchVal}`
            );
        }}
      >
        <i className="bi bi-search text-lg"></i>
      </button>
    </div>
  );
}
