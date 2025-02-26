"use client";

import { homeUrl } from "../Utils/variables";
import Link from "next/link";
import { getTranslation } from "../Utils/variables";
import { useLanguageContext } from "../Context/LanguageContext";
import { useRouter } from "next/navigation";

export default function AccountMenu({
  title,
  url,
  logout,
  locale
}) {

 

  const { translation } = useLanguageContext();

  return (
    <Link href={`${homeUrl}${locale}/${url}`}>
      <div
        className={`${
          logout
            ? "border px-4 py-3 justify-center text-center sm:m-4 mb-0 mx-4 mt-4 rounded-lg"
            : "px-4 sm:py-5 py-4 justify-between lg:hover:opacity-50"
        }  transition-all border-b border-border !py-4  gap-4 bg-white `}
      >
        <div className="flex items-center justify-center gap-3">
          <button className="btn-account">
            {getTranslation(translation[0]?.translations, title, locale || 'en')}
          </button>
        </div>
      </div>
    </Link>
  );
}
