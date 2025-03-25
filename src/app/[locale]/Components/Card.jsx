import Link from "next/link";
import Images from "./Images";
import {
  apiUrl,
  convertCurrency,
  convertStringToJSON,
  formatDateString,
  getTranslation,
  homeUrl,
  siteName,
} from "../Utils/variables";
import AddToCart from "./AddToCart";
import Price from "./Price";
import ReviewCount from "./ReviewCount";
import AddToWishList from "./AddToWishList";
import Loading from "./LoadingItem";
import Avatar from "./Avatar";
import ReadMore from "./ReadMore";
import { Suspense } from "react";
import ProductName from "./ProductName";
import OutOfStock from "./OutOfStock";

export default function Card({
  title,
  review,
  account,
  data,
  large,
  subcategoryFromUrl,
  locale,
  mainCategoryName,
  subCategoryName,
  childCategoryName,
  type,
}) {
  //CHECK NEED LICENCE FOR BUY THIS PRODUCT
  const isNeedLicence =
    data &&
    data?.meta_data?.find((item) => item.key === "_required_valid_documents");

  if (type === "categoryLarge") {
    return (
      <li>
        <Link href={`${homeUrl}${locale}/products/${data?.slug}`} className="">
          <div>
            <Images
              imageurl={`${data?.featured_image_details?.src}`}
              quality="100"
              width="250"
              height="250"
              alt={`${data?.featured_image_details?.alt}`}
              title={`${data?.featured_image_details?.alt}`}
              classes="block sm:size-[250px] size-[80px] object-contain mx-auto"
              placeholder={true}
            />
            <h3 className="heading-md mt-5 text-center line-clamp-2">
              <ProductName
                title={
                  locale === "en"
                    ? data?.title?.rendered || data?.name
                    : data?.acf?.title_arabic
                    ? data?.acf?.title_arabic
                    : data?.title?.rendered || data?.name
                }
              />
            </h3>
          </div>
        </Link>
      </li>
    );
  }

  if (type === "subcategoryLarge") {
    return (
      <li>
        <Link
          href={`${homeUrl}${locale}/products/${
            subcategoryFromUrl || mainCategoryName || mainCategoryName?.slug
          }/${data?.slug}`}
          className="hover:text-primary transition-all"
        >
          <div>
            <Images
              imageurl={`${data?.featured_image_details?.src}`}
              quality="100"
              width="250"
              height="250"
              alt="Powering Your Tactical Needs"
              title="Powering Your Tactical Needs"
              classes="block sm:size-[250px] size-[80px] object-contain mx-auto"
              placeholder={true}
            />
            <h3 className="heading-md mt-5 text-center line-clamp-2">
              <ProductName
                title={
                  locale === "en"
                    ? data?.title?.rendered
                    : data?.acf?.title_arabic
                    ? data?.acf?.title_arabic
                    : data?.title?.rendered
                }
              />
            </h3>
          </div>
        </Link>
      </li>
    );
  }

  if (type === "childcategoryLarge") {
    return (
      <li>
        <Link
          href={`${homeUrl}${locale}/products/${
            subcategoryFromUrl || mainCategoryName?.slug
          }/${subcategoryFromUrl || subCategoryName?.slug}/${data?.slug}`}
          className="hover:text-primary transition-all"
        >
          <div>
            <Images
              imageurl={`${data?.featured_image_details?.src}`}
              quality="100"
              width="250"
              height="250"
              alt="Powering Your Tactical Needs"
              title="Powering Your Tactical Needs"
              classes="block sm:size-[250px] size-[80px] object-contain mx-auto"
              placeholder={true}
            />
            <h3 className="heading-md mt-5 text-center line-clamp-2">
              <ProductName
                title={
                  locale === "en"
                    ? data?.title?.rendered
                    : data?.acf?.title_arabic
                    ? data?.acf?.title_arabic
                    : data?.title?.rendered
                }
              />
            </h3>
          </div>
        </Link>
      </li>
    );
  }

  if (type === "category") {
    return (
      <li>
        <Link
          href={`${homeUrl}${locale}/products/${
            data?.url?.split("/").slice(-2, -1)[0]
          }`}
        >
          <div>
            <Images
              imageurl={`${
                data?.featured_image_details?.src || data?.acf?.image?.url
              }`}
              quality="100"
              width="100"
              height="100"
              alt={data?.title?.rendered || data?.title}
              title={data?.title?.rendered || data?.title}
              classes="block sm:size-[90px] size-[60px] object-contain mx-auto"
              placeholder={true}
            />
            <h3 className="heading-md mt-5 text-center line-clamp-2">
              <ProductName
                title={
                  locale === "en"
                    ? title
                    : data?.acf?.title_arabic
                    ? data?.acf?.title_arabic
                    : title
                }
              />
            </h3>
          </div>
        </Link>
      </li>
    );
  }

  if (type === "subcategory") {
    return (
      <li>
        <Link
          href={`${homeUrl}${locale}/products/${data?.acf?.main_categories[0]?.post_name}/${data?.slug}`}
          className="hover:text-primary transition-all"
        >
          <div>
            <Images
              imageurl={`${data?.featured_image_details?.src}`}
              quality="100"
              width="100"
              height="100"
              alt={data?.featured_image_details?.alt}
              title={data?.featured_image_details?.alt}
              classes="block sm:size-[60px] size-[60px] mx-auto w-full object-contain w-full"
              placeholder={true}
            />

            <div className="grid gap-3">
              <h3 className="heading-sm secondary-font font mt-2">
                <ProductName
                  title={
                    locale === "en"
                      ? data?.title?.rendered
                      : data?.acf?.title_arabic
                      ? data?.acf?.title_arabic
                      : data?.title?.rendered
                  }
                />
              </h3>
            </div>
          </div>
        </Link>
      </li>
    );
  }

  //FOR PRODUCTS
  if (type === "product") {
    return (
      <div className="relative product-item p-0">
        <div className="grid  gap-[10px] h-full">
          <div className="img-box">
            <OutOfStock status={data?.stock_status} />
            {data?.review_count > 0 && (
              <ReviewCount
                average={data?.average_rating}
                ratingCount={data?.review_count}
              />
            )}
            <div className="card-action absolute bg-white bg-opacity-90 inset-0 items-center justify-center hidden lg:flex">
              <div className="flex gap-3 items-center justify-center">
                <AddToWishList
                  small
                  itemName={data?.name}
                  productId={data?.id}
                />

                <AddToCart
                  card
                  itemid={data?.id}
                  price={
                    data?.price !== null ? data?.price : data?.regular_price
                  }
                  name={data?.name}
                  image={data?.images?.featured?.url || data?.images}
                  slug={data?.slug}
                  isNeedLicence={isNeedLicence?.value}
                  category={mainCategoryName}
                  subCategory={subCategoryName}
                  childCategory={childCategoryName}
                  stock={data?.stock_status}
                />

                <Link
                  href={`${homeUrl}${locale}/products/${mainCategoryName}/${subCategoryName}/${childCategoryName}/${data?.slug}`}
                  className="bg-white flex hover:bg-primary hover:text-white hover:[&>*]:text-white !h-[60px] rounded-full lg:size-[60px] size-[40px] transition-all items-center justify-center  border border-border"
                >
                  <i className="bi bi-eye"></i>
                </Link>
              </div>
            </div>
            <div className="absolute right-0 top-0 lg:hidden">
              <AddToWishList
                smallCardTop
                itemName={data?.name}
                productId={data?.id}
              />
            </div>
            <Link
              className="flex"
              href={`${homeUrl}${locale}/products/${mainCategoryName}/${subCategoryName}/${childCategoryName}/${data?.slug}`}
            >
              <Images
                imageurl={`${
                  data?.images?.featured?.url ||
                  data?.featured_image_details?.src
                }`}
                quality="100"
                width="300"
                height="300"
                alt={data?.images?.featured?.alt}
                title={data?.images?.featured?.alt}
                classes="block xl:size-[300px] sm:size-[200px] size-[150px] object-contain mx-auto"
                placeholder={true}
              />
            </Link>
          </div>
          <div className="contents items-center justify-center w-full mt-2 min-h-[115px] sm:min-h-fit">
            <Link
              href={`${homeUrl}${locale}/products/${mainCategoryName}/${subCategoryName}/${childCategoryName}/${data?.slug}`}
            >
              <h3 className="sm:text-[14px] text-[12px] sm:mb-3 mb-1 line-clamp-1 text-center">
                <ProductName
                  title={
                    locale === "en"
                      ? data?.name
                      : data?.meta_data.filter(
                          (item) => item.key === "_name_in_arabic"
                        )[0]?.value
                      ? data?.meta_data.filter(
                          (item) => item.key === "_name_in_arabic"
                        )[0]?.value
                      : data?.name
                  }
                />
              </h3>

              {data?.price && (
                <Price
                  isCard
                  regular={data?.regular_price}
                  sale={data?.sale_price}
                />
              )}
            </Link>

            <div className="flex gap-2 items-center justify-center sm:mt-4 mt-2 lg:hidden w-full">
              <AddToCart
                card
                itemid={data?.id}
                price={data?.price !== null ? data?.price : data?.regular_price}
                name={data?.name}
                image={data?.images?.featured?.url || data?.images}
                slug={data?.slug}
                isNeedLicence={isNeedLicence?.value}
                category={mainCategoryName}
                subCategory={subCategoryName}
                childCategory={childCategoryName}
                stock={data?.stock_status}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "blog") {
    return (
      <Link
        href={`${homeUrl}${locale}/blogs/${data?.slug}`}
        className="hover:text-primary transition-all"
      >
        <div>
          <Images
            imageurl={`${
              data?.featured_image_url || data?.featured_image_details?.src
            }`}
            quality="100"
            width="500"
            height="500"
            alt={data?.alt || data?.featured_image_details?.alt}
            title={data?.alt || data?.featured_image_details?.alt}
            classes={`${
              large ? "lg:h-[350px] h-[250px]" : "xl:h-[300px] sm:h-[200px]"
            } block  object-cover w-full`}
            placeholder={true}
          />
          <div className="grid gap-3">
            <h3 className="heading-md mt-5">{data?.title?.rendered}</h3>
            <small className="text-black text-xs font-normal leading-tight">
              {formatDateString(data?.date)}
            </small>
          </div>
        </div>
      </Link>
    );
  }

  const renderStars = (count) => {
    const stars = [];
    const totalStars = 5; // Assuming a maximum of 5 stars for the review rating

    // Render filled stars (yellow)
    for (let i = 0; i < count; i++) {
      stars.push(
        <i
          key={`full-${i}`}
          className={`bi bi-star-fill text-primary text-lg`}
        ></i>
      );
    }

    // Render empty stars
    for (let i = count; i < totalStars; i++) {
      stars.push(
        <i key={`full-${i}`} className={`bi bi-star text-gray-200 text-lg`}></i>
      );
    }

    return stars;
  };

  if (review) {
    return (
      <li>
        <div className="grid">
          <div className="flex justify-between items-center">
            <small className="text-black/50 text-xs font-normal leading-tight block">
              {data?.date_created && formatDateString(data?.date_created)}
            </small>
            <div className="flex gap-1">{renderStars(data?.rating)}</div>
          </div>
          <small>
            {account ? (
              <div className="justify-start items-center gap-1 inline-flex mt-4 ">
                <Images
                  imageurl={
                    data?.product_image || "/images/image-placeholder.webp"
                  }
                  quality="100"
                  width="100"
                  height="100"
                  title={data?.product_name || item?.product_name}
                  alt={data?.product_name || item?.product_name}
                  classes="size-[50px] block mx-auto object-contain"
                  placeholder={true}
                />
                <div className="text-black text-sm font-medium primary-font">
                  {data?.product_name}
                </div>
              </div>
            ) : (
              <div className="justify-start items-center gap-3 inline-flex mt-4">
                <Avatar url={data?.reviewer_avatar_urls || ""} />
                <div className="grow shrink basis-0 text-black text-sm font-medium leading-[18px]">
                  {data?.reviewer}
                </div>
              </div>
            )}
          </small>
        </div>
        <div className="[&>*]:leading-relaxed  mt-2">
          <Suspense fallback={<Loading dot />}>
            <ReadMore maxLength="30" children={data?.review} />
          </Suspense>
        </div>
      </li>
    );
  }
}
