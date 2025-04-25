import { Suspense } from "react";
import PageHeader from "@/app/[locale]/Components/PageHeader";
import {
  apiUrl,
  homeUrl,
  metaStaticData,
  siteLogo,
  siteName,
  sortByStockStatus,
  woocommerceKey,
} from "@/app/[locale]/Utils/variables";
import Card from "@/app/[locale]/Components/Card";
import Alerts from "@/app/[locale]/Components/Alerts";
import Pagination from "@/app/[locale]/Components/Pagination";
import LoadingItem from "@/app/[locale]/Components/LoadingItem";
import ProductWrapper from "@/app/[locale]/Components/ProductWrapper";

export default async function SubCategoryPage({
  params,
  searchParams,
  params: { locale },
}) {
  const { subcategory } = await params;
  

  const { filter_items } = await searchParams;
  const { meta_key } = await searchParams;
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

 

 

  //SUB CATEGORY
  let subCat = await fetch(
    `${apiUrl}wp-json/wp/v2/sub-categories?slug=${subcategory}&lang=${
      locale || "en"
    }`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  
  //PRODUCTS
  let products = await fetch(
    `${apiUrl}wp-json/custom/v1/products?sub_categories_new[]=${subCat[0]?.id}${
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

  //PRODUCTS FILTERS || LENGTH
  let productsGetFilters = await fetch(
    `${apiUrl}wp-json/custom/v1/products?sub_categories_new[]=${subCat[0]?.id}`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  //FILTER
  const finalFilterItems = productsGetFilters?.flatMap((product) => {
    const filteredMetaData = product.meta_data?.filter(
      (item) => item.key === "_filter_items" && item.value
    );

    if (!filteredMetaData || filteredMetaData.length === 0) return [];

    const labelAccumulator = {};

    filteredMetaData.forEach((item) => {
      const valuePairs = item.value.split(",");

      valuePairs.forEach((pair) => {
        const [key, value] = pair.split("~:");

        if (!key || !value) return;

        const [en, ar] = value.split("|");

        if (!en || !ar) return;

        if (!labelAccumulator[key]) {
          labelAccumulator[key] = {
            label: key,
            items: [],
            arabicLabel: [],
            seen: new Set(),
          };
        }

        const uniquePair = `${en}|${ar}`;

        if (!labelAccumulator[key].seen.has(uniquePair)) {
          labelAccumulator[key].items.push({ en, ar });
          labelAccumulator[key].arabicLabel.push({ en, ar });
          labelAccumulator[key].seen.add(uniquePair);
        }
      });
    });

    return Object.values(labelAccumulator);
  });

  const result = [];

  finalFilterItems.forEach((entry) => {
    const existing = result.find((r) => r.label === entry.label);

    if (existing) {
      entry.items.forEach((item) => {
        const duplicateCheck = `${item.en}|${item.ar}`;

        if (!existing.seen.has(duplicateCheck)) {
          existing.items.push(item);
          existing.seen.add(duplicateCheck);
        }
      });
    } else {
      result.push({
        label: entry.label,
        items: entry.items,
        seen: new Set(),
      });
    }
  });

  result.forEach((entry) => {
    entry.items = entry.items.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.en === item.en && t.ar === item.ar)
    );
  });

  // Modify to the desired output format
  const formattedResult = result.flatMap((entry) =>
    entry.items.map((item) => ({
      val: `${entry.label}~:${item.en}|${item.ar}`,
    }))
  );

  
   const sortedProducts = sortByStockStatus(products);
  

  return (
    <div className="bg-bggray">
      <section className="p-0">
        <Suspense fallback={<LoadingItem fullscreen />}>
          <PageHeader
            activeFilterMetas={meta_value}
            shopPageLevel={1}
            title={
              locale === "en"
                ? subCat[0]?.title?.rendered
                : subCat[0]?.acf?.title_arabic
                ? subCat[0]?.acf?.title_arabic
                : subCat[0]?.title?.rendered
            }
            filter="subcategory"
            filterData={formattedResult}
            sortProducts
          />
        </Suspense>
        {!products?.length ? (
          // When no products are available, show a loading fallback or an alert.
          <Suspense fallback={<LoadingItem fullscreen />}>
            <Alerts
              noLogo
              title="Sorry, no products found!"
              large
              url={homeUrl}
            />
          </Suspense>
        ) : (
          <>
            <div
              className={`${products?.length > 0 && "sm:py-10 py-5"} container`}
            >
              <div className="grid xl:grid-cols-4 grid-cols-2 lg:gap-7 gap-3">
                <ProductWrapper
                  locale={locale}
                  data={products && sortedProducts}
                  searchParams={subcategory}
                  type="product"
                />
              </div>

              <Suspense fallback={<LoadingItem fullscreen />}>
                <div className="sm:pt-5 pt-2 w-full">
                  <Pagination
                    currentPage={1} // Assuming you want to start at page 1
                    totalActiveData={products?.length}
                    totalPages={productsGetFilters?.length}
                    baseUrl={homeUrl}
                    itemsShowPerPage={itemsShowPerPage}
                  />
                </div>
              </Suspense>
            </div>
          </>
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
