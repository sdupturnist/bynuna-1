"use client";

import Images from "./Images";
import {
  apiUrl,
  convertStringToJSON,
  currency,
  homeUrl,
  OfferPercentage,
} from "../Utils/variables";
import ReviewCount from "./ReviewCount";
import AddToCart from "./AddToCart";
import AddToWishList from "./AddToWishList";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Skelton from "./Skelton";
import Price from "./Price";
import { useSiteContext } from "../Context/siteContext";
import Loading from "./LoadingItem";

export default function ProductCard({
  data,
  column,
  mobileList,
  inCartPage,
  wishlistPage,
  miniCard,
}) {
  const category = useParams();

  const { hideCartItem } = useSiteContext();

  const itemCaturl = homeUrl + data?.categories[0]?.slug;

  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(false);

  //CHECK NEED LICENCE FOR BUY THIS PRODUCT
  const isNeedLicence =
    data &&
    data?.meta_data?.find((item) => item.key === "required_valid_documents");

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  // const filterWishListFromItems = data && data.filter(product => product.id === 66);

  const leftRightCard = loading ? (
    <Skelton productleftRightCard />
  ) : (
    <li className="w-full sm:w-auto sm:mr-2 justify-between py-5 sm:pb-0 first:pt-0 relative">
      {clicked && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-white z-[9] flex items-center justify-center bg-opacity-90">
          <Loading dot classes="size-5" />
        </div>
      )}
      <AddToWishList small itemName={data?.name} productId={data?.id} />
      <div className="sm:grid flex relative h-full w-full sm:gap-0 gap-4 pb-1">
        <div className="border rounded-md sm:h-auto sm:w-auto h-[100px] w-[100px] sm:border-0 flex sm:block items-center justify-center ">
          <Link
            onClick={() => setClicked(!clicked)}
            className="flex items-center justify-center sm:min-w-32 sm:min-h-[250px]"
            href={`${itemCaturl}/${data?.slug}`}
          >
            <Images
              imageurl={
                data?.images[0]?.src ||
                (data?.images.length > 0 && data?.images)
              }
              quality="100"
              width="150"
              height="150"
              title={`${data?.images[0]?.alt || data?.name}`}
              alt={`${data?.images[0]?.alt || data?.name}`}
              classes="block sm:size-[250px] size-[80px] sm:my-[15px] m-0 mx-auto object-contain"
              placeholder={true}
            />
          </Link>
        </div>

        <div className="w-full grid items-center sm:px-4 sm:pb-3 sm:max-w-full max-w-[50%]">
          <div>
            <Link
              onClick={() => setClicked(!clicked)}
              href={`${itemCaturl}/${data?.slug}`}
            >
              <h3 className="product-title leading-[1.6em] text-dark mb-2">
                {data?.name}
              </h3>
            </Link>
            {data?.rating_count > 0 && (
              <ReviewCount
                average={data?.average_rating}
                ratingCount={data?.rating_count}
              />
            )}
            {data?.price && (
              <Price regular={data?.regular_price} sale={data?.price} />
            )}

            <div>
              {!inCartPage && data?.price && (
                <AddToCart
                  card
                  itemid={data?.id}
                  price={
                    data?.price !== null ? data?.price : data?.regular_price
                  }
                  name={data?.name}
                  image={data?.images[0]?.src || data?.images}
                  slug={data?.slug}
                  isNeedLicence={parseInt(isNeedLicence?.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );

  const leftRightCardMobile = loading ? (
    <>
      <div className="sm:block hidden">
        <Skelton productCard />
      </div>
      <div className="sm:hidden">
        <Skelton productleftRightCard />
      </div>
    </>
  ) : (
    <li className="w-full sm:w-auto sm:mr-2 justify-between py-5 sm:pb-0 first:pt-0 relative">
      {clicked && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-white z-[9] flex items-center justify-center bg-opacity-90">
          <Loading dot classes="size-5" />
        </div>
      )}
      <AddToWishList small itemName={data?.name} productId={data?.id} />
      <div className="sm:grid flex relative h-full sm:w-full sm:max-w-full max-w-[85%] sm:gap-0 gap-4 pb-1">
        <div className="border rounded-md sm:h-auto sm:w-auto h-[100px] w-[100px] sm:border-0 flex sm:block items-center justify-center">
          <Link
            onClick={() => setClicked(!clicked)}
            className="flex items-center justify-center sm:min-w-32 sm:min-h-[250px]"
            href={`${itemCaturl}/${data?.slug}`}
          >
            <Images
              imageurl={
                data?.images[0]?.src ||
                (data?.images.length > 0 && data?.images)
              }
              quality="100"
              width="150"
              height="150"
              title={`${data?.images[0]?.alt || data?.name}`}
              alt={`${data?.images[0]?.alt || data?.name}`}
              classes="block sm:size-[250px] size-[80px] sm:my-[15px] m-0 mx-auto object-contain"
              placeholder={true}
            />
          </Link>
        </div>

        <div className="w-full grid items-center sm:px-4 sm:pb-3 sm:max-w-full max-w-[50%]">
          <div>
            <Link
              onClick={() => setClicked(!clicked)}
              href={`${itemCaturl}/${data?.slug}`}
            >
              <h3 className="product-title leading-[1.6em] text-dark mb-2">
                {data?.name}
              </h3>
            </Link>
            {data?.rating_count > 0 && (
              <ReviewCount
                average={data?.average_rating}
                ratingCount={data?.rating_count}
              />
            )}
            {data?.price && (
              <Price regular={data?.regular_price} sale={data?.price} />
            )}

            <div>
              {!inCartPage && data?.price && (
                <AddToCart
                  card
                  itemid={data?.id}
                  price={
                    data?.price !== null ? data?.price : data?.regular_price
                  }
                  name={data?.name}
                  image={data?.images[0]?.src || data?.images}
                  slug={data?.slug}
                  isNeedLicence={parseInt(isNeedLicence?.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );

  //TOP

  const miniCardColumn = loading ? (
    <>
      <div className="sm:block hidden">
        <Skelton productCard />
      </div>
      <div className="sm:hidden">
        <Skelton productleftRightCard />
      </div>
    </>
  ) : (
    <li className="w-full sm:w-auto sm:mr-2 justify-between  relative">
      {clicked && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-white z-[9] flex items-center justify-center bg-opacity-90">
          <Loading dot classes="size-5" />
        </div>
      )}
      <AddToWishList small itemName={data?.name} productId={data?.id} />
      <div className="flex relative h-full w-full sm:gap-0 gap-5">
        <div className="img-box">
          <Link
            onClick={() => setClicked(!clicked)}
            className="block w-full"
            href={`${itemCaturl}/${data?.slug}`}
          >
            <Images
              imageurl={
                data?.images[0]?.src ||
                (data?.images.length > 0 && data?.images)
              }
              quality="100"
              width="200"
              height="200"
              title={`${data?.images[0]?.alt || data?.name}`}
              alt={`${data?.images[0]?.alt || data?.name}`}
              classes="block sm:size-[50px] size-[50px] my-[15px] mx-auto object-contain"
              placeholder={true}
            />
          </Link>
        </div>

        <div className="w-full grid items-center sm:px-4 sm:max-w-[70%] max-w-[60%]">
          <div>
            <Link
              onClick={() => setClicked(!clicked)}
              href={`${itemCaturl}/${data?.slug}`}
            >
              <h3 className="product-title leading-[1.6em] text-dark mb-2">
                {data?.name}
              </h3>
            </Link>
            {data?.rating_count > 0 && (
              <ReviewCount
                average={data?.average_rating}
                ratingCount={data?.rating_count}
              />
            )}
            {data?.price && (
              <Price regular={data?.regular_price} sale={data?.price} />
            )}

            <div>
              {!inCartPage && data?.price && (
                <AddToCart
                  card
                  itemid={data?.id}
                  price={
                    data?.price !== null ? data?.price : data?.regular_price
                  }
                  name={data?.name}
                  image={data?.images[0]?.src || data?.images}
                  slug={data?.slug}
                  isNeedLicence={parseInt(isNeedLicence?.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );

  //CASE START

  let card;

  switch (true) {
    case column:
      card = leftRightCard;
      break;

    case mobileList:
      card = leftRightCardMobile;
      break;

    case miniCard:
      card = miniCardColumn;
      break;

    case wishlistPage:
      card = loading ? (
        <div className={hideCartItem[data?.id] ? "hidden" : ""}>
          <div className="sm:block hidden">
            <Skelton productCard />
          </div>
          <div className="sm:hidden">
            <Skelton productleftRightCard />
          </div>
        </div>
      ) : (
        <div className="product-card relative overflow-hidden">
          <AddToWishList
            small
            active
            itemName={data?.name}
            productId={data?.id}
            hideRemovedItem
          />
          {clicked && (
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-white z-[9] flex items-center justify-center bg-opacity-90">
              <Loading dot classes="size-5" />
            </div>
          )}
          <Link
            onClick={() => setClicked(!clicked)}
            href={`${itemCaturl}/${data?.slug}`}
            className="img-link"
          >
            <Images
              imageurl={
                data?.images[0]?.src ||
                (data?.images.length > 0 && data?.images)
              }
              quality="100"
              width="250"
              height="250"
              title={`${data?.images[0]?.alt || data?.name}`}
              alt={`${data?.images[0]?.alt || data?.name}`}
              classes="block mx-auto object-contain"
              placeholder={true}
            />
          </Link>
          <div className="sm:p-4 p-3 flex flex-col flex-grow relative">
            <Link
              onClick={() => setClicked(!clicked)}
              href={`${itemCaturl}/${data?.slug}`}
            >
              <h3 className="product-title">{data?.name}</h3>
            </Link>
            <div className="flex items-center absolute top-[-8px]">
              {data?.rating_count > 0 && (
                <ReviewCount
                  average={data?.average_rating}
                  ratingCount={data?.rating_count}
                />
              )}
            </div>
            {data?.price && (
              <Price regular={data?.regular_price} sale={data?.price} />
            )}
            <div className="mt-auto">
              {!inCartPage && data?.price && (
                <AddToCart
                  card
                  itemid={data?.id}
                  price={
                    data?.price !== null ? data?.price : data?.regular_price
                  }
                  name={data?.name}
                  image={data?.images[0]?.src || data?.images}
                  slug={data?.slug}
                  isNeedLicence={parseInt(isNeedLicence?.value)}
                />
              )}
            </div>
          </div>
        </div>
      );
      break;

    default:
      // Return nothing or a default layout
      card = loading ? (
        <>
          <div className={`sm:block hidden`}>
            <Skelton productCard />
          </div>
          <div className="sm:hidden">
            <Skelton productleftRightCard />
          </div>
        </>
      ) : (
        <div className="product-card relative overflow-hidden">
          {clicked && (
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-white z-[9] flex items-center justify-center bg-opacity-90">
              <Loading dot classes="size-5" />
            </div>
          )}
          <AddToWishList
            small
            active
            itemName={data?.name}
            productId={data?.id}
          />

          <Link
            onClick={() => setClicked(!clicked)}
            href={`${itemCaturl}/${data?.slug}`}
            className="img-link"
          >
            <Images
              imageurl={
                data?.images[0]?.src ||
                (data?.images.length > 0 && data?.images)
              }
              quality="100"
              width="250"
              height="250"
              title={`${data?.images[0]?.alt || data?.name}`}
              alt={`${data?.images[0]?.alt || data?.name}`}
              classes="block mx-auto object-contain"
              placeholder={true}
            />
          </Link>
          <div className="sm:p-4 p-3 flex flex-col flex-grow relative">
            <Link
              onClick={() => setClicked(!clicked)}
              href={`${itemCaturl}/${data?.slug}`}
            >
              <h3 className="product-title">{data?.name}</h3>
            </Link>
            <div className="flex items-center absolute top-[-8px]">
              {data?.rating_count > 0 && (
                <ReviewCount
                  average={data?.average_rating}
                  ratingCount={data?.rating_count}
                />
              )}
            </div>
            {data?.price && (
              <Price regular={data?.regular_price} sale={data?.price} />
            )}
            <div className="mt-auto">
              {!inCartPage && data?.price && (
                <AddToCart
                  card
                  itemid={data?.id}
                  price={
                    data?.price !== null ? data?.price : data?.regular_price
                  }
                  name={data?.name}
                  image={data?.images[0]?.src || data?.images}
                  slug={data?.slug}
                  isNeedLicence={parseInt(isNeedLicence?.value)}
                />
              )}
            </div>
          </div>
        </div>
      );
      break;
  }

  return card;
}
