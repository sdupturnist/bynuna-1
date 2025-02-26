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
  woocommerceKey,
} from "@/app/[locale]/Utils/variables";

import Link from "next/link";
import { Suspense } from "react";

export default async function ProductSingle({
  params,
  searchParams,
  params: { locale },
}) {
  const { slug } = params;

  let singleProductData = await fetch(
    `${apiUrl}wp-json/wc/v3/products/filter${woocommerceKey}&slug=${slug}&lang=${
      locale || "en"
    }`,
    {
      next: { revalidate: 60 },
    }
  );

  let allProductsData = await fetch(
    `${apiUrl}wp-json/wc/v3/products/filter${woocommerceKey}&slug=${slug}&per_page=99&lang=${
      locale || "en"
    }`,
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

  const primarySpecifications = singleProduct?.meta_data.filter(
    (item) => item.key === "_filter_items"
  );

  //CHECK NEED LICENCE FOR BUY THIS PRODUCT
  const isNeedLicence =
    singleProduct &&
    singleProduct?.meta_data?.find(
      (item) => item.key === "required_valid_documents"
    );

  //const relatedProducts = relatedProductsGet?.products;
  let productReview = await productReviewData.json();
  let allProducts = await allProductsData.json();

  const crossSellIds = singleProduct && singleProduct?.cross_sell_ids;
  const upsellsIds = singleProduct && singleProduct?.upsell_ids;

  const crossSellProducts =
    allProducts &&
    allProducts.filter(
      (product) => crossSellIds && crossSellIds.includes(product.id)
    );

  const upsellProducts =
    allProducts &&
    allProducts.filter(
      (product) => upsellsIds && upsellsIds.includes(product.id)
    );

  const accordianItems = [
    singleProduct?.description && {
      title: "Description",
      content: singleProduct?.description && (
        <div
          className="py-4"
          dangerouslySetInnerHTML={{
            __html: singleProduct?.description,
          }}
        />
      ),
    },
    primarySpecifications[0]?.value !== ""
      ? {
          title: "Primary specifications",
          content: (
            <div className="py-4">
              <GenerateTable tableData={primarySpecifications} />
            </div>
          ),
        }
      : null,
    singleProduct?.acf?.additional_info?.delivery_returns && {
      title: "Delivery & Returns",
      content: (
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: singleProduct?.acf?.additional_info?.delivery_returns,
          }}
        />
      ),
    },
    singleProduct?.acf?.additional_info?.security_payments && {
      title: "Security & Payments",
      content: (
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: singleProduct?.acf?.additional_info?.security_payments,
          }}
        />
      ),
    },
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

  return (
    <main className="bg-light lg:bg-white product-single">
      <div className="mobile-container-fixed">
        <div className="bg-white px-5 lg:px-0 py-3 sm:py-0">
          <Breadcrumb />
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
                  {singleProduct?.images?.gallery?.length > 0 && (
                    <ProductGallery data={singleProduct?.images?.gallery} />
                  )}
                </Suspense>
              </div>
            </div>
            <div className="text-center items-center w-full mt-4 md:mt-0">
              <div className="grid sm:gap-5 gap-3 mb-5">
                <h1 className="sm:text-2xl text-lg">
                  {singleProduct && singleProduct?.name}
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
              {singleProduct?.short_description && (
                <div
                  className="content mb-5 [&>*]:text-sm"
                  dangerouslySetInnerHTML={{
                    __html: singleProduct && singleProduct?.short_description,
                  }}
                />
              )}

              {singleProduct?.price && (
                <div className="flex gap-3 items-center justify-center bg-white mt-6 sm:mt-7">
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
                    isNeedLicence={parseInt(isNeedLicence?.value)}
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
              {/* <div className="join join-vertical w-full general-content">
      {accordianItems.map((item, index) =>
        item ? (
          <div key={index} className="collapse collapse-arrow join-item">
            <input type="radio" name="my-accordion-4" defaultChecked={index === 0} />
            <div className="collapse-title font-bold border-b px-0 primary-font sm:text-[14px] text-sm">{item.title}</div>
            <div className="collapse-content px-0">{item.content}</div>
          </div>
        ) : null
      )}
    </div> */}
              <Accordion general noHtml items={accordianItems} />
            </div>
          </div>

          <div className="bg-white grid spacing-gap">
            {upsellProducts.length > 0 && (
              <div className="mt-">
                <div className="section-header-card !p-0">
                  <SectionHeader
                    title="You may also like"
                    spacingSm
                    titleCenter
                  />
                  <ProductWrapper
                    data={upsellProducts && upsellProducts}
                    searchParams={searchParams}
                  />
                </div>
              </div>
            )}
            {crossSellProducts && crossSellProducts.length > 0 && (
              <div className="border-t sm:border-black border-border sm:py-10 py-5">
                <div className="section-header-card !p-0">
                  <SectionHeader
                    title="Related Products"
                    spacingSm
                    titleCenter
                  />
                  <ProductWrapper
                    data={crossSellProducts && crossSellProducts}
                    searchParams={searchParams}
                  />
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

  try {
    const page = await fetch(
      `${apiUrl}wp-json/wc/v3/products${woocommerceKey}&slug=${slug}&lang=en`,

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

      author: siteAuthor || staticData.author, // Dynamic author or static fallback
      viewport: "width=device-width, initial-scale=1",
      robots: pageData?.yoast_head_json?.robots || staticData.robots,
      alternates: {
        canonical: homeUrl + "blogs/" + pageData?.slug,
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
          pageData?.yoast_head_json?.og_image?.[0]?.url ||
            staticData.openGraph?.images,
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    // Return static data in case of an error
    return staticData;
  }
}
