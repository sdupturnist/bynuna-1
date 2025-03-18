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
import ProductWrapper from "../../Components/ProductWrapper";

export default async function SearchPage({ params, searchParams, params: { locale } }) {

  const searchTerm = searchParams.search || 'No search term';



  

  const { meta_key } = await searchParams;
  const { meta_value } = await searchParams;
  const { min_price } = await searchParams;
  const { max_price } = await searchParams;
  const { featured } = await searchParams;
  const { sortby } = await searchParams;
  const { sortVal } = await searchParams;
  const { per_page } = await searchParams;

  const itemsShowPerPage = per_page || 32;



  //PRODUCTS
  let products = await fetch(
    `${apiUrl}wp-json/wc/v3/products${woocommerceKey}&search=${searchTerm}&lang=${locale}`,
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
            title={searchTerm}
            //filterData={filteredProductFilters}
          //  sortProducts
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
          <div className="grid md:grid-cols-3 grid-cols-2 lg:gap-7 gap-3">
             <ProductWrapper
                              locale={locale}
                              data={products && products}
                              searchParams={searchParams}
                              type="product"
                            />

            {/* {products?.length > 0 &&
              products.map((item, index) => (
                <Card key={index} data={item} product locale={locale} />
              ))} */}
          </div>
          <Suspense fallback={<LoadingItem fullscreen />}>
            <div className="sm:pt-5 pt-2 w-full">
              {/* <Pagination
                currentPage={parseInt(1, 10)}
                totalActiveData={products && products?.length}
                totalPages={productsGetFilters && productsGetFilters?.length}
                baseUrl={`${homeUrl}`}
                itemsShowPerPage={itemsShowPerPage}
              /> */}
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
      viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
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
