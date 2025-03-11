"use client";

import Link from "next/link";
import { getTranslation, homeUrl } from "../Utils/variables";
import { useParams, usePathname } from "next/navigation";
import { useLanguageContext } from "../Context/LanguageContext";
import { useSiteContext } from "../Context/siteContext";

export default function Breadcrumb({ data, title }) {
  const { locale } = useParams();
  // const pathname = usePathname();
  const { translation } = useLanguageContext();
  const { categories, subCategories, childCategories } = useSiteContext();

  // Split the pathname and filter out the language code (en or ar)
  // const pathSegments = pathname
  //   .split("/")
  //   .filter((segment) => segment && segment !== "en" && segment !== "ar"); // Exclude 'en' and 'ar'

  const filterCat =
    categories &&
    categories.filter(
      (item) => item.slug === data?.main_categories[0]?.post_name
    );
  const filterSubCat =
    subCategories &&
    subCategories.filter(
      (item) => item.slug === data?.sub_categories[0]?.post_name
    );
  const filterChildCat =
    childCategories &&
    childCategories.filter(
      (item) => item.slug === data?.child_categories[0]?.post_name
    );

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
            href={`${homeUrl}${locale}/products/${data?.main_categories[0]?.post_name}`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html:
                  locale === "en"
                    ? filterCat[0]?.title?.rendered
                    : filterCat[0]?.acf?.title_arabic
                    ? filterCat[0]?.acf?.title_arabic
                    : filterCat[0]?.title?.rendered,
              }}
            />
          </Link>
        </li>
        <li>
          <Link
            href={`${homeUrl}${locale}/products/${data?.main_categories[0]?.post_name}/${data?.sub_categories[0]?.post_name}`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html:
                  locale === "en"
                    ? filterSubCat[0]?.title?.rendered
                    : filterSubCat[0]?.acf?.title_arabic
                    ? filterSubCat[0]?.acf?.title_arabic
                    : filterSubCat[0]?.title?.rendered,
              }}
            />
          </Link>
        </li>
        <li>
          <Link
            href={`${homeUrl}${locale}/products/${data?.main_categories[0]?.post_name}/${data?.sub_categories[0]?.post_name}//${data?.child_categories[0]?.post_name}`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html:
                  locale === "en"
                    ? filterChildCat[0]?.title?.rendered
                    : filterChildCat[0]?.acf?.title_arabic
                    ? filterChildCat[0]?.acf?.title_arabic
                    : filterChildCat[0]?.title?.rendered,
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
