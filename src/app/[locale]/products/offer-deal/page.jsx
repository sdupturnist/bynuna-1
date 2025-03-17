import { Suspense } from "react";
import PageHeader from "../../Components/PageHeader";
import {
  apiUrl,
  homeUrl,
  metaStaticData,
  siteLogo,
  siteName,
} from "../../Utils/variables";

import Alerts from "../../Components/Alerts";
import Pagination from "../../Components/Pagination";
import LoadingItem from "../../Components/LoadingItem";
import ProductWrapper from "../../Components/ProductWrapper";

export default async function BrandPage({
  params,
  searchParams,
  params: { locale },
}) {
  const { filter_items } = await searchParams;
  const { meta_value } = await searchParams;
  const { min_price } = await searchParams;
  const { max_price } = await searchParams;
  const { sortby } = await searchParams;
  const { sortVal } = await searchParams;
  const { per_page } = await searchParams;

  const itemsShowPerPage = per_page || 32;

  // Step 1: Split the string based on the `&` symbol
  let parts = filter_items && filter_items.split("&");

  // Step 2: Create the updated string
  let updatedString =
    parts &&
    parts
      .map((part) => {
        if (part.includes("filter_items=")) {
          // Extract the value after `filter_items=`
          let value = part.split("=")[1];
          return `&filter_items[]=${value}`;
        } else {
          return `&filter_items[]=${part}`;
        }
      })
      .join("");

  //PRODUCTS
  let products = await fetch(
    `${apiUrl}wp-json/custom/v1/products?_offer_deal=yes${
      updatedString ? updatedString : ""
    }&per_page=${itemsShowPerPage}&order_by=${sortby || "name"}&order=${
      sortVal || "asc"
    }&min_price=${min_price ? min_price : 0}&max_price=${
      max_price ? max_price : 0
    }`,

    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  let totalProducts = await fetch(
    `${apiUrl}wp-json/custom/v1/products?_offer_deal=yes&per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  return (
    <div className="bg-bggray">
      <section className="p-0">
        <Suspense fallback={<LoadingItem fullscreen />}>
          <PageHeader
            activeFilterMetas={meta_value}
            shopPageLevel={1}
            title="Offer Deal"
            sortProducts
          />
        </Suspense>
        {!products?.length > 0 ? (
          <Alerts
            noLogo
            title="Sorry, no products found!"
            large
            url={homeUrl}
            //desc={`Thanks for signing up! Please check your email for a confirmation link to finish your registration.`}
          />
        ) : (
          <div
            className={`${products?.length > 0 && "sm:py-10 py-5"} container`}
          >
            <div className="grid xl:grid-cols-4 grid-cols-2 lg:gap-7 gap-3">
              <ProductWrapper
                locale={locale}
                data={products && products}
                searchParams={searchParams}
                type="product"
              />
            </div>
            <Suspense fallback={<LoadingItem fullscreen />}>
              <div className="sm:pt-5 pt-2 w-full">
                <Pagination
                  currentPage={parseInt(1, 10)}
                  totalActiveData={products && products?.length}
                  totalPages={totalProducts && totalProducts?.length}
                  baseUrl={`${homeUrl}`}
                  itemsShowPerPage={itemsShowPerPage}
                />
              </div>
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}

export async function generateMetadata({ params, searchParams }, parent) {
  const staticData = metaStaticData;

  try {
    const page = await fetch(
      `${apiUrl}wp-json/wp/v2/pages?slug=sub-category&lang=en`,

      {
        next: { revalidate: 60 },
      }
    );

    const [pageData] = await page.json();

    // Return metadata object with dynamic values, or fall back to static values
    return {
      title:
        pageData?.yoast_head_json?.title ||
        pageData?.yoast_head_json?.og_title ||
        staticData.title,
      description:
        pageData?.yoast_head_json?.og_description || staticData.og_description,

      author: siteName + " Admin",
      viewport: "width=device-width, initial-scale=1",
      robots: pageData?.yoast_head_json?.robots || staticData.robots,
      alternates: {
        canonical: homeUrl,
      },
      og_locale: pageData?.yoast_head_json?.og_locale || staticData.og_locale,
      og_type: pageData?.yoast_head_json?.og_type || staticData.og_type,
      og_title: pageData?.yoast_head_json?.og_title || staticData.og_title,
      og_description:
        pageData?.yoast_head_json?.og_description || staticData.og_description,
      og_url: pageData?.yoast_head_json?.og_url
        ?.replace("/admin", "")
        .replace("/home", ""),
      article_modified_time:
        pageData?.yoast_head_json?.article_modified_time ||
        staticData.article_modified_time,
      twitter_card: staticData.twitter_card,
      twitter_misc:
        pageData?.yoast_head_json?.twitter_misc || staticData.twitter_misc,
      twitter_site: staticData.twitter_site,
      twitter_creator: staticData.twitter_creator,
      twitter_image:
        pageData?.yoast_head_json?.og_image?.[0]?.url ||
        siteLogo ||
        staticData.twitter_image,
      openGraph: {
        images: [
          pageData?.yoast_head_json?.og_image?.[0]?.url || staticData.ogImage,
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    // Return static data in case of an error
    return staticData;
  }
}
