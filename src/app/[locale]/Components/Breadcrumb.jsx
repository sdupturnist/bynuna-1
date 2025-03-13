"use client";

import Link from "next/link";
import { getTranslation, homeUrl } from "../Utils/variables";
import { useParams, usePathname } from "next/navigation";
import { useLanguageContext } from "../Context/LanguageContext";
import { useSiteContext } from "../Context/siteContext";

export default function Breadcrumb({ data, title, mainCategory, subCategory, childCategory }) {


  const { locale } = useParams();
  // const pathname = usePathname();
  const { translation } = useLanguageContext();
  const { categories, subCategories, childCategories } = useSiteContext();


  return (
    <div className="breadcrumbs text-xs sm:py-2 py-0">
      <ul className="flex space-x-2 ">
        <li>
          <Link href={homeUrl} className="first-letter:capitalize">
            {getTranslation(
              translation[0]?.translations,
              "Home",
              locale || "en"
            )}
          </Link>
        </li>
        <li>
          <Link
            href={`${homeUrl}${locale}/products`}
            className="first-letter:capitalize"
          >
            {getTranslation(
              translation[0]?.translations,
              "Products",
              locale || "en"
            )}
          </Link>
        </li>
        <li>
          <Link
            href={`${homeUrl}${locale}/products/${mainCategory?.slug}`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html:
                  locale === "en"
                    ? mainCategory?.title?.rendered
                    : mainCategory?.acf?.title_arabic
                    ? mainCategory?.acf?.title_arabic
                    : mainCategory?.title?.rendered,
              }}
            />
          </Link>
        </li>
        <li>
          <Link
            href={`${homeUrl}${locale}/products/${mainCategory?.slug}/${subCategory?.slug}`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html:
                  locale === "en"
                    ? subCategory?.title?.rendered
                    : subCategory?.acf?.title_arabic
                    ? subCategory?.acf?.title_arabic
                    : subCategory?.title?.rendered,
              }}
            />
          </Link>
        </li>
        <li>
          <Link
            href={`${homeUrl}${locale}/products/${mainCategory?.slug}/${subCategory?.slug}/${childCategory?.slug}`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html:
                  locale === "en"
                    ? childCategory?.title?.rendered
                    : childCategory?.acf?.title_arabic
                    ? childCategory?.acf?.title_arabic
                    : childCategory?.title?.rendered,
              }}
            />
          </Link>
        </li>
        <li>{title}</li>
        {/* {pathSegments.map((segment, index) => {
          const path =   `${homeUrl}${locale}/${pathSegments.slice(0, index + 1).join("/")}`;

          return (
            <li key={path}>
              {index === pathSegments.length - 1 ? (
                <span>{segment.replace("-", " ")}</span>
              ) : (
                <Link href={path}>{segment.replace("-", " ")}</Link>
              )}
            </li>
          );
        })} */}
      </ul>
    </div>
  );
}
