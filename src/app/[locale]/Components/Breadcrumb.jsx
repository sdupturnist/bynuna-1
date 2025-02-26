"use client";

import Link from "next/link";
import { getTranslation, homeUrl } from "../Utils/variables";
import { useParams, usePathname } from "next/navigation";
import { useLanguageContext } from "../Context/LanguageContext";

export default function Breadcrumb() {
  const { locale } = useParams();
  const pathname = usePathname();
  const { translation } = useLanguageContext();

  // Split the pathname and filter out the language code (en or ar)
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "en" && segment !== "ar"); // Exclude 'en' and 'ar'

  return (
    <div className="breadcrumbs text-xs sm:py-2 py-0">
      <ul className="flex space-x-2">
        <li>
          <Link href={homeUrl}>
            {getTranslation(translation[0]?.translations, "Home", locale || 'en')}
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

          return (
            <li key={path}>
              {index === pathSegments.length - 1 ? (
                <span>{segment.replace("-", " ")}</span>
              ) : (
                <Link href={path}>{segment.replace("-", " ")}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
