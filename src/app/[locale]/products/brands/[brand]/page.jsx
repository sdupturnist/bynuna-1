import { Suspense } from "react";

import {
  apiUrl,
  homeUrl,
  metaStaticData,
  siteLogo,
  siteName,
  woocommerceKey,
} from "@/app/[locale]/Utils/variables";
import Alerts from "@/app/[locale]/Components/Alerts";
import Pagination from "@/app/[locale]/Components/Pagination";
import PageHeader from "@/app/[locale]/Components/PageHeader";
import LoadingItem from "@/app/[locale]/Components/LoadingItem";
import Card from "@/app/[locale]/Components/Card";
import ProductWrapper from "@/app/[locale]/Components/ProductWrapper";


export default async function BrandPage({ params, searchParams, params: { locale } }) {


  const { brand } = await params;

  const { meta_key } = await searchParams;
  const { meta_value } = await searchParams;
  const { min_price } = await searchParams;
  const { max_price } = await searchParams;
  const { featured } = await searchParams;
  const { sortby } = await searchParams;
  const { sortVal } = await searchParams;
  const { per_page } = await searchParams;

  const itemsShowPerPage = per_page || 32;

  let resultFilterParams = "";

  if (meta_key === undefined || meta_value === undefined) {
    resultFilterParams = "";
  } else if (Array.isArray(meta_key) && Array.isArray(meta_value)) {
    resultFilterParams = meta_key
      .map((key, index) => {
        const cleanedMetaValue =
          meta_value && meta_value[index]
            ? meta_value[index].replace(/-.*$/, "")
            : "";

        return cleanedMetaValue
          ? `&meta_key=${key}&meta_value[]=${cleanedMetaValue}`
          : "";
      })
      .filter(Boolean)
      .join("");
  } else {
    const cleanedMetaValue = meta_value ? meta_value.replace(/-.*$/, "") : "";

    resultFilterParams = cleanedMetaValue
      ? `&meta_key=${meta_key}&meta_value[]=${cleanedMetaValue}`
      : "";
  }

  //BRAND
  let brands = await fetch(
    `${apiUrl}wp-json/wp/v2/brands?slug=${brand}&lang=${locale || 'en'}`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  //PRODUCTS
  let products = await fetch(
    `${apiUrl}wp-json/wc/v3/products/filter?meta_value=${
      brands[0]?.id
    }&meta_key=brands_new${resultFilterParams}&min_price=${
      min_price || 0
    }&max_price=${max_price || 0}&per_page=${itemsShowPerPage}&sort_by=${
      sortby || "name"
    }&order=${sortVal || "asc"}`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  //PRODUCTS FILTERS || LENGTH
  let productsGetFilters = await fetch(
    `${apiUrl}wp-json/wc/v3/products/filter${woocommerceKey}&meta_value=${
      brand[0]?.id
    }&meta_key=sub_categories`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  const finalFilterItems = productsGetFilters?.flatMap((product) => {
    const filteredMetaData = product.meta_data?.filter(
      (item) => item.key === "_filter_items" && item.value
    );

    if (!filteredMetaData) return []; // Return empty if no metadata

    const labelAccumulator = {};

    // Process each metadata entry
    filteredMetaData.forEach((item) => {
      item.value.split(",").forEach((pair) => {
        const [label, value] = pair.split(":").map((str) => str.trim());
        if (!labelAccumulator[label]) labelAccumulator[label] = new Set();
        labelAccumulator[label].add(value);
      });
    });

    // Convert labelAccumulator to the desired structure
    return Object.keys(labelAccumulator).map((label) => ({
      label,
      items: Array.from(labelAccumulator[label]).map((value) => ({
        item: value,
      })),
    }));
  });

  const result = [];

  // Merge items by label
  finalFilterItems.forEach((entry) => {
    const existing = result.find((r) => r.label === entry.label);
    if (existing) {
      existing.items.push(...entry.items); // Spread operator to add items
    } else {
      result.push({ label: entry.label, items: entry.items }); // Add new label
    }
  });

  // Filter by matching labels in brand
  const filteredProductFilters = result.filter(
    (productFilter) =>
      brand[0]?.acf?.filters &&
      brand[0]?.acf?.filters.some(
        (catFilter) => catFilter.post_name === productFilter.label
      )
  );

  return (
    <div className="bg-bggray">
      <section className="p-0">
        <Suspense fallback={<LoadingItem fullscreen />}>
          <PageHeader
            activeFilterMetas={meta_value}
            shopPageLevel={1}
            title={brand}
            filterData={filteredProductFilters}
            sortProducts
          />
        </Suspense>
        {!products?.length > 0 ? 
          <Alerts
            noLogo
            title="Sorry, no products found!"
            large
            url={homeUrl}
            //desc={`Thanks for signing up! Please check your email for a confirmation link to finish your registration.`}
          />
        :
        <div className={`${products?.length > 0 && "sm:py-10 py-5"} container`}>
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
                totalPages={productsGetFilters && productsGetFilters?.length}
                baseUrl={`${homeUrl}`}
                itemsShowPerPage={itemsShowPerPage}
              />
            </div>
          </Suspense>
        </div>
}
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
          pageData?.yoast_head_json?.og_image?.[0]?.url ||
            staticData.ogImage,
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    // Return static data in case of an error
    return staticData;
  }
}
