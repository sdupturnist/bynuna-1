"use client";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { homeUrl } from "../Utils/variables";
import Link from "next/link";
import Cookies from "js-cookie";
import { useLanguageContext } from "../Context/LanguageContext";
import { getTranslation } from "../Utils/variables";
import { useParams, useRouter } from "next/navigation";

export default function SectionHeader({
  title,
  url,
  filter,
  filterData,
  button,
  buttonLabel,
  buttonAction,
  card,
  noSpacing,
  titleSmall,
  small,
  titleCenter,
  
}) {

    
    const router = useRouter();
   const params = useParams();  
   const locale = params.locale; 

    const { translation } = useLanguageContext();


  return (
    <div
      className={`${
        !noSpacing && "sm:mb-5 mb-4"
      } flex justify-between items-center uppercase`}>
      {small && !titleSmall && <p className="opacity-50">{getTranslation(translation[0]?.translations, "Payment options", locale || 'en')}</p>}
      {card && !titleSmall && (
        <h3
          className={`${
            titleCenter && "text-center w-full"
          } text-lg font-semibold`}>
          {getTranslation(translation[0]?.translations, title, locale || 'en')}
        </h3>
      )}
      {titleSmall && (
        <h3
          className={`${
            titleCenter ? "text-center w-full" : ""
          } text-base font-bold first-letter:capitalize`}>
         {getTranslation(translation[0]?.translations, title, locale || 'en')}
        </h3>
      )}
      {!card && !small && !titleSmall && (
        <h3
          className={`${
            titleCenter && "text-center w-full"
          } sm:text-lg text-[15px] first-letter:capitalize`}>
         {getTranslation(translation[0]?.translations, title, locale || 'en')}
        </h3>
      )}
      {!filter && url && !button && (
        <Link href={url} className="text-primary text-sm">
           {getTranslation(translation[0]?.translations, 'More', locale || 'en')}
        </Link>
      )}
      {button && (
        <Link href={buttonAction} className="btn btn-medium btn-light">
          {getTranslation(translation[0]?.translations, buttonLabel, locale || 'en')}
        </Link>
      )}
      {filter && (
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="text-sm text-body">
            <AdjustmentsHorizontalIcon className="size-5" />
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {filterData &&
              filterData.map((item, index) => (
                <li key={index}>
                  <Link href={`${homeUrl}${locale}/${item?.slug}`}>{item?.name}</Link>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
