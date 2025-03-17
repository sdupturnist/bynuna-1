// import { useTranslations } from "next-intl"
// import { Link } from "@/i18n/routing"

// export default function HomePage() {
//   const t = useTranslations("HomePage")
//   return (
//     <div>
//       <h1>{t("title")}</h1>
//       <Link href="/about">{t("about")}</Link>
//     </div>
//   )
// }

//export const revalidate = 3600

import HeroSlider from "./Components/HeroSlider";
import CategorySlider from "./Components/CategorySlider";
import Button from "./Components/Button";
import {
  apiUrl,
  homeUrl,
  metaStaticData,
  siteLogo,
  siteName,
  woocommerceKey,
} from "./Utils/variables";
import Card from "./Components/Card";
import BrandSlider from "./Components/BrandSlider";
import ProductWrapper from "./Components/ProductWrapper";

export default async function Home({
  params,
  searchParams,
  params: { locale },
}) {
  //PAGE
  let pageData = await fetch(
    `${apiUrl}wp-json/wp/v2/pages?slug=home-${locale || "en"}`,
    {
      next: { revalidate: 60 },
    }
  );

  let page = await pageData.json();

  //HERO
  let heroData = await fetch(
    `${apiUrl}wp-json/wp/v2/hero?lang=${locale || "en"}`,
    {
      next: { revalidate: 60 },
    }
  );

  let hero = await heroData.json();

  //BLOGS
  let blogs = await fetch(
    `${apiUrl}wp-json/wp/v2/posts?per_page=3&lang=${locale || "en"}`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  //PRODUCTS
  let products = await fetch(
    `${apiUrl}wp-json/custom/v1/products?per_page=8`,

    { 
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));


    console.log(products)

  //SUBCAT
  let subCategoreis = await fetch(
    `${apiUrl}wp-json/wp/v2/sub-categories?per_page=99&lang=${locale}`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));



  return (
    <>
      <section className="sm:h-[70vh] h-[50vh] p-0 overflow-hidden sm:text-start text-center">
        <HeroSlider data={hero} locale={locale} />
      </section>
      <section className="lg:py-10 py-0 sm:!pb-0">
        <div className="text-center">
          <CategorySlider locale={locale} />
        </div>
      </section>
    
     {products?.length !== 0 &&  <section className="p-0 lg:pt-10 sm:pt-5 text-center">
        <div className="container border-t sm:border-black border-border spacing-normal spacing-gap">
          <h2 className="heading-lg">
            {page[0]?.acf?.featured_products?.featured_products_heading}
          </h2>
          <div className="grid xl:grid-cols-4 grid-cols-2 lg:gap-8 gap-3">
            <ProductWrapper
              locale={locale}
              data={products && products}
              searchParams={searchParams}
              type="product"
              
            />
          </div>
        </div>
      </section>
}
      <section className="p-0 text-center">
        <ul className={`${products?.length === 0 ? 'sm:mt-10' : ''} sm:max-w-[90%] mx-auto border-t sm:border-black border-border spacing sub-cat-list`}>
         
         {subCategoreis &&  subCategoreis?.map((item, index) => (
                  
                   <Card
                     type='subcategory'
                     key={index}
                     data={item}
                     locale={locale}
                    />
                 ))}
          
        </ul>
      </section>
      <section className="p-0 text-center">
        <div className="container conatiner-fixed border-b sm:border-black border-border spacing !pt-0">
          <div className="md:max-w-[767px] mx-auto grid gap-5">
            <h2 className="heading-lg">
              {page[0]?.acf?.more_products?.more_products_heading}
            </h2>
            <p>{page[0]?.acf?.more_products?.more_products_description}</p>
            <div>
              <Button
                link
                url={`${homeUrl}${locale}/contact-us`}
                label={page[0]?.acf?.more_products?.more_products_button}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="p-0 text-center">
        <div className="container border-b sm:border-black border-border spacing !pb-10">
          <h2 className="heading-lg  mb-5">
            {page[0]?.acf?.brands?.brands_heading}
          </h2>
          <BrandSlider locale={locale} />
        </div>
      </section>
      {blogs.length > 1 && (
        <section className="p-0">
          <div className="container border-b sm:border-black border-border spacing spacing-gap">
            <h2 className="heading-lg text-center">
              {page[0]?.acf?.blogs?.blogs_heading}
            </h2>
            <div className="grid md:grid-cols-3  justify-evenly items-start gap-10">
              {blogs &&
                blogs.map((item, index) => (
                  <Card key={index} data={item} type="blog" locale={locale} />
                ))}
            </div>
          </div>
        </section>
      )}
      <section className="p-0 text-center">
        <div className="container border-b sm:border-black border-border spacing">
          <div className="md:max-w-[767px] mx-auto grid gap-5">
            <h2 className="heading-lg">
              {page[0]?.acf?.welcome_to_bynuna?.welcome_to_bynuna_heading}
            </h2>
            <p>
              {page[0]?.acf?.welcome_to_bynuna?.welcome_to_bynuna_description}
            </p>
            <div>
              <Button
                link
                url={`${homeUrl}${locale}/about-us`}
                label={
                  page[0]?.acf?.welcome_to_bynuna?.welcome_to_bynuna_button
                }
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params, searchParams }, parent) {
  const staticData = metaStaticData;

  try {
    const page = await fetch(
      `${apiUrl}wp-json/wp/v2/pages?slug=home-en`,

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
        canonical: homeUrl + "en",
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
