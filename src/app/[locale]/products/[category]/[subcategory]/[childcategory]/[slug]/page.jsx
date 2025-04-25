import SocialShare from "@/app/[locale]/Components/SocialShare";
import Accordion from "@/app/[locale]/Components/Accordion";
import AddToCart from "@/app/[locale]/Components/AddToCart";
import AddToWishList from "@/app/[locale]/Components/AddToWishList";
import Alerts from "@/app/[locale]/Components/Alerts";
import Breadcrumb from "@/app/[locale]/Components/Breadcrumb";
import WriteReviewForm from "@/app/[locale]/Components/Forms/WriteReviewForm";
import LoadingItem from "@/app/[locale]/Components/LoadingItem";
import OfferTag from "@/app/[locale]/Components/OfferTag";
import Price from "@/app/[locale]/Components/Price";
import ProductGallery from "@/app/[locale]/Components/ProductGallery";
import GenerateTable from "@/app/[locale]/Components/ProductSingleTable";
import ProductWrapper from "@/app/[locale]/Components/ProductWrapper";
import ReviewCount from "@/app/[locale]/Components/ReviewCount";
import Reviews from "@/app/[locale]/Components/Reviews";
import ReviewStatus from "@/app/[locale]/Components/ReviewStatus";
import SectionHeader from "@/app/[locale]/Components/SectionHeader";

import {
  apiUrl,
  convertStringToJSON,
  homeUrl,
  metaStaticData,
  siteAuthor,
  siteName,
  sortByStockStatus,
  woocommerceKey,
} from "@/app/[locale]/Utils/variables";

import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import OutOfStock from "@/app/[locale]/Components/OutOfStock";

export default async function ProductSingle({
  params,
  searchParams,
  params: { locale },
}) {
  const { slug } = params;

  let singleProductData = await fetch(
    `${apiUrl}wp-json/custom/v1/products?slug=${slug}`,
    {
      next: { revalidate: 60 },
    }
  );

  let allProductsData = await fetch(
    `${apiUrl}wp-json/custom/v1/products?per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  );

  const [singleProduct] = await singleProductData.json();

  let productReviewData = await fetch(
    `${apiUrl}wp-json/wc/v3/products/reviews${woocommerceKey}&product=${singleProduct?.id}`,
    {
      next: { revalidate: 60 },
    }
  );

  let deliveryreturnsData = await fetch(
    `${apiUrl}wp-json/wp/v2/delivery-and-returns?lang=${locale || "en"}`,
    {
      next: { revalidate: 60 },
    }
  );

  const [deliveryreturns] = await deliveryreturnsData.json();

  let securitypaymentsData = await fetch(
    `${apiUrl}wp-json/wp/v2/security-payments?lang=${locale || "en"}`,
    {
      next: { revalidate: 60 },
    }
  );

  const [securitypayments] = await securitypaymentsData.json();

  const primarySpecifications = singleProduct?.meta_data.filter(
    (item) => item.key === "_filter_items"
  );

  //CHECK NEED LICENCE FOR BUY THIS PRODUCT
  const isNeedLicence =
    singleProduct &&
    singleProduct?.meta_data?.find(
      (item) => item.key === "_required_valid_documents"
    );

  //const relatedProducts = relatedProductsGet?.products;
  let productReview = await productReviewData.json();
  let allProducts = await allProductsData.json();

  const cross_sell_ids = singleProduct && singleProduct?.cross_sell_ids;
  const upsell_ids = singleProduct && singleProduct?.upsell_ids;

  const crossSellProducts =
    allProducts &&
    allProducts.filter(
      (product) => cross_sell_ids && cross_sell_ids.includes(product.id)
    );

  const upsellProducts =
    allProducts &&
    allProducts.filter(
      (product) => upsell_ids && upsell_ids.includes(product.id)
    );

    

 

  const accordianItems = [
    singleProduct?.description || singleProduct?.acf?.arabic?.description
      ? {
          title: "Description",
          content:
            singleProduct?.description ||
            singleProduct?.meta_data.filter(
              (item) => item.key === "_description_in_arabic"
            )[0]?.value ? (
              <div
                className="py-4"
                dangerouslySetInnerHTML={{
                  __html:
                    locale === "en"
                      ? singleProduct?.description
                      : singleProduct?.meta_data.filter(
                          (item) => item.key === "_description_in_arabic"
                        )[0]?.value
                      ? singleProduct?.meta_data.filter(
                          (item) => item.key === "_description_in_arabic"
                        )[0]?.value
                      : singleProduct?.description,
                }}
              />
            ) : null,
        }
      : null,

    // Primary specifications: Show if valid primarySpecifications
    {
      title: "Primary specifications",
      content:
        primarySpecifications[0]?.value !== "" ? (
          <div className="py-4">
            <GenerateTable tableData={primarySpecifications} />
          </div>
        ) : null,
    },

    // Delivery & Returns: Show if valid deliveryreturns
    deliveryreturns && {
      title: "Delivery & Returns",
      content: (
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html:
              deliveryreturns !== ""
                ? deliveryreturns?.content?.rendered
                : null,
          }}
        />
      ),
    },

    // Security & Payments: Show if valid securitypayments
    securitypayments && {
      title: "Security & Payments",
      content: (
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html:
              deliveryreturns !== ""
                ? securitypayments?.content?.rendered
                : null,
          }}
        />
      ),
    },

    // Reviews section
    {
      title: "Reviews",
      content: (
        <>
          <div>
            {productReview.length > 0 ? (
              <>
                <ReviewStatus reviews={productReview} />
                <Reviews data={productReview && productReview} />
              </>
            ) : (
              <div className="items-start">
                <Alerts status="primary" title="No reviews available yet" />
                <div className="text-center mt-5 w-full max-w-xl mx-auto bg-green-20 sm:!mb-10">
                  <SectionHeader title="Leave a Review" titleCenter />
                  <div>
                    <WriteReviewForm productId={singleProduct?.id} />
                  </div>
                </div>
              </div>
            )}
          </div>
          {productReview.length > 0 && (
            <div className="text-center mt-5 w-full max-w-xl mx-auto bg-green-20 sm:!mb-10">
              <SectionHeader title="Leave a Review" titleCenter />
              <div>
                <WriteReviewForm productId={singleProduct?.id} />
              </div>
            </div>
          )}
        </>
      ),
    },
  ];

  let mainCategoriesData = await fetch(
    `${apiUrl}/wp-json/custom/v1/main-categories-data/?per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  let subCategoriesData = await fetch(
    `${apiUrl}/wp-json/custom/v1/sub-categories-data/?per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  let childCategoriesData = await fetch(
    `${apiUrl}wp-json/custom/v1/child-categories-data/?per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  const mainCatById = (id) => {
    return mainCategoriesData.filter((item) => item.id === parseInt(id));
  };

  const subCatById = (id) => {
    return subCategoriesData.filter((item) => item.id === parseInt(id));
  };

  const childCatById = (id) => {
    return childCategoriesData.filter((item) => item.id === parseInt(id));
  };

  return (
    <main className="bg-light lg:bg-white product-single">
      <div className="mobile-container-fixed">
        <div className="bg-white px-5 lg:px-0 py-3 sm:py-0">
          <Breadcrumb
            title={
              locale === "en"
                ? singleProduct?.name
                : singleProduct?.meta_data.filter(
                    (item) => item.key === "_name_in_arabic"
                  )[0]?.value
                ? singleProduct?.meta_data.filter(
                    (item) => item.key === "_name_in_arabic"
                  )[0]?.value
                : singleProduct?.name
            }
            mainCategory={
              mainCatById(
                singleProduct?.meta_data.filter(
                  (item) => item.key === "main_categories_new"
                )[0]?.value
              )[0]
            }
            subCategory={
              subCatById(
                singleProduct?.meta_data.filter(
                  (item) => item.key === "sub_categories_new"
                )[0]?.value
              )[0]
            }
            childCategory={
              childCatById(
                singleProduct?.meta_data.filter(
                  (item) => item.key === "child_categories_new"
                )[0]?.value
              )[0]
            }
          />
        </div>
        <section className="grid lg:gap-0 gap-2 pb-0 lg:pt-10 pt-0">
          <div className="bg-white grid grid-cols-1 lg:gap-7 gap-5 items-center lg:grid-cols-[50%_50%] product-single lg:py-0 pb-10  px-5 lg:px-0">
            <div>
              <div className=" sm:min-h-[600px]  bg-white min-h-80 relative">
                <div className="absolute right-2 top-2 z-[50]">
                  <AddToWishList
                    inSinglePage
                    activeWishlist={singleProduct?.id}
                    itemName={singleProduct?.name}
                    productId={singleProduct?.id}
                  />
                </div>

                {parseInt(singleProduct?.regular_price) >=
                  parseInt(singleProduct?.sale_price) && (
                  <div className="offer-badge">
                    <OfferTag
                      normalprice={singleProduct?.regular_price}
                      saleprice={singleProduct?.sale_price}
                    />
                  </div>
                )}

                <Suspense fallback={<LoadingItem spinner />}>
                  {singleProduct?.images ? (
                    singleProduct?.images?.gallery?.length > 0 ? (
                      <ProductGallery data={singleProduct?.images?.gallery} />
                    ) : (
                      <ProductGallery
                        data={singleProduct?.images?.featured?.url}
                      />
                    )
                  ) : (
                    <div className="border aspect-square flex items-center justify-center sm:p-10 p-5">
                      <Image
                        width="600"
                        height="600"
                        quality="100"
                        src="/images/placeholder_brand.jpg"
                        className="block w-full"
                        alt={siteName}
                        title={siteName}
                      />
                    </div>
                  )}
                </Suspense>
              </div>
            </div>
            <div className="text-center items-center w-full mt-4 md:mt-0">
              <div className="grid sm:gap-5 gap-3 mb-5">
                <h1 className="sm:text-2xl text-lg">
                  {locale === "en"
                    ? singleProduct?.name
                    : singleProduct?.meta_data.filter(
                        (item) => item.key === "_name_in_arabic"
                      )[0]?.value
                    ? singleProduct?.meta_data.filter(
                        (item) => item.key === "_name_in_arabic"
                      )[0]?.value
                    : singleProduct?.name}
                </h1>
                {productReview.length > 0 && (
                  <Link
                    href="#reviews"
                    className="flex items-center justify-center w-full"
                  >
                    <ReviewCount
                      average={singleProduct?.average_rating}
                      ratingCount={singleProduct?.rating_count}
                      large
                    />
                  </Link>
                )}
              </div>
              <div className="sm:my-7 my-5">
                <Price
                  regular={singleProduct?.regular_price}
                  sale={singleProduct?.sale_price}
                />
              </div>
              {singleProduct?.short_description &&
                (locale === "en" ? (
                  singleProduct?.short_description && (
                    <div
                      className="content mb-5 [&>*]:text-sm"
                      dangerouslySetInnerHTML={{
                        __html: singleProduct?.short_description,
                      }}
                    />
                  )
                ) : singleProduct?.meta_data.filter(
                    (item) => item.key === "_short_description_in_arabic"
                  )[0]?.value ? (
                  <div
                    className="content mb-5 [&>*]:text-sm"
                    dangerouslySetInnerHTML={{
                      __html: singleProduct?.meta_data.filter(
                        (item) => item.key === "_short_description_in_arabic"
                      )[0]?.value,
                    }}
                  />
                ) : (
                  <div
                    className="content mb-5 [&>*]:text-sm"
                    dangerouslySetInnerHTML={{
                      __html: singleProduct?.short_description,
                    }}
                  />
                ))}

              {singleProduct?.price && (
                <div className="flex gap-3 items-center justify-center bg-white mt-6 sm:mt-7">
                  <OutOfStock single status={singleProduct?.stock_status} />

                  <AddToCart
                    itemid={singleProduct?.id ?? null}
                    price={
                      singleProduct?.sale_price !== null
                        ? singleProduct?.regular_price
                        : singleProduct?.sale_price
                    }
                    name={singleProduct?.name}
                    image={singleProduct?.images[0]?.src}
                    options={convertStringToJSON(
                      singleProduct && singleProduct?.acf?.options
                    )}
                    singlePage
                    slug={singleProduct?.slug}
                    isNeedLicence={isNeedLicence?.value}
                    category={
                      mainCatById(
                        singleProduct?.meta_data.filter(
                          (item) => item.key === "main_categories_new"
                        )[0]?.value
                      )[0]?.slug
                    }
                    subCategory={
                      subCatById(
                        singleProduct?.meta_data.filter(
                          (item) => item.key === "sub_categories_new"
                        )[0]?.value
                      )[0]?.slug
                    }
                    childCategory={
                      childCatById(
                        singleProduct?.meta_data.filter(
                          (item) => item.key === "child_categories_new"
                        )[0]?.value
                      )[0]?.slug
                    }
                    stock={singleProduct?.stock_status}
                  />
                </div>
              )}

              <div className="border-t border-border sm:mt-10 mt-8 sm:pt-10 pt-5 grid items-center justify-center">
                <SocialShare
                  url={`${homeUrl}/${locale}/${
                    singleProduct?.categories &&
                    singleProduct?.categories[0]?.slug
                  }/${singleProduct?.slug}`}
                  title={`${singleProduct?.name}`}
                />
              </div>
            </div>
          </div>
          <div className="bg-white lg:mb-14">
            <div className="px-5 lg:px-0 grid gap-5 more-info">
              <Accordion general noHtml items={accordianItems} />
            </div>
          </div>

          <div className="bg-white grid sm:spacing-gap">
            {upsellProducts.length > 0 && (
              <div className="px-3 pt-5 lg:p-0">
                <div className="section-header-card !p-0">
                  <SectionHeader
                    title="You may also like"
                    spacingSm
                    titleCenter
                  />
                  <div className="grid xl:grid-cols-4 grid-cols-2 lg:gap-7 gap-3 sm:my-10 mb-5">
                    <ProductWrapper
                       locale={locale}
                      data={upsellProducts && sortByStockStatus(upsellProducts)}
                      searchParams={searchParams}
                      type="product"
                    />
                  </div>
                </div>
              </div>
            )}
            {crossSellProducts && crossSellProducts.length > 0 && (
              <div className="border-t sm:border-black border-border sm:py-10 py-5">
                <div className="px-3 pb-5 lg:p-0">
                  <div className="section-header-card !p-0">
                    <SectionHeader
                      title="Related Products"
                      spacingSm
                      titleCenter
                    />
                    <div className="grid xl:grid-cols-4 grid-cols-2 lg:gap-7 gap-3 sm:my-10 my-5">
                      <ProductWrapper
                          locale={locale}
                            data={crossSellProducts && sortByStockStatus(crossSellProducts)}
                        searchParams={searchParams}
                        type="product"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export async function generateMetadata({ params, searchParams }, parent) {
  const staticData = metaStaticData;

  const slug = params.slug;
  const locale = params.locale;

  try {
    const page = await fetch(
      `${apiUrl}wp-json/wc/v3/products${woocommerceKey}&slug=${slug}&lang=en`,

      {
        next: { revalidate: 60 },
      }
    );

    const [pageData] = await page.json();

    let mainCategoryData = await fetch(
      `${apiUrl}wp-json/wp/v2/main-categories?id=${
        pageData?.meta_data?.filter(
          (item) => item.key === "main_categories_new"
        )[0]?.id
      }&per_page=1`,
      {
        next: { revalidate: 60 },
      }
    );

    const [mainCategory] = await mainCategoryData.json();

    let subCategoryData = await fetch(
      `${apiUrl}wp-json/wp/v2/sub-categories?id=${
        pageData?.meta_data?.filter(
          (item) => item.key === "sub_categories_new"
        )[0]?.id
      }&per_page=1`,
      {
        next: { revalidate: 60 },
      }
    );

    const [subCategory] = await subCategoryData.json();

    let childCategoryData = await fetch(
      `${apiUrl}wp-json/wp/v2/child-categories?id=${
        pageData?.meta_data?.filter(
          (item) => item.key === "child_categories_new"
        )[0]?.id
      }&per_page=1`,
      {
        next: { revalidate: 60 },
      }
    );

    const [childCategory] = await childCategoryData.json();

    // Return metadata object with dynamic values, or fall back to static values
    return {
      title:
        pageData?.yoast_head_json?.title ||
        pageData?.yoast_head_json?.og_title ||
        staticData.title,
      description:
        pageData?.yoast_head_json?.og_description || staticData.og_description,

      author: siteAuthor || staticData.author, // Dynamic author or static fallback
      robots: pageData?.yoast_head_json?.robots || staticData.robots,
      alternates: {
        canonical: `${homeUrl}${locale}/products/${
          mainCategory && mainCategory?.slug
        }/${subCategory && subCategory?.slug}/${
          childCategory && childCategory?.slug
        }/${pageData?.slug}`,
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
