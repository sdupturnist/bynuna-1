"use client";

import { useEffect, useState } from "react";
import { useCartContext } from "../Context/cartContext";
import AddToCart from "./AddToCart";
import {
  apiUrl,
  convertStringToJSON,
  getTranslation,
  homeUrl,
  siteName,
} from "../Utils/variables";
import Link from "next/link";
import Images from "./Images";
import Price from "./Price";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";
import Alerts from "./Alerts";

export default function CartListItem({}) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { cartItems, setCartItems, cartListedItems } = useCartContext();

  const { translation } = useLanguageContext();

  const [products, setProducts] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/custom/v1/products?per_page=1000`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Load items from localStorage on component mount
  useEffect(() => {
    getAllProducts();

    // Get the cart items from localStorage
    const storedItems =
      typeof window !== "undefined" && localStorage.getItem(`${siteName}_cart`);

    // Ensure cartItems is always an array
    setCartItems(storedItems ? JSON.parse(storedItems) : []);
  }, [setCartItems, router]);

  // Merge and map the cart with product details
  const mergedCart =
    Array.isArray(cartItems) &&
    cartItems
      .map((item) => {
        const product =
          Array.isArray(cartListedItems) &&
          cartListedItems.find((p) => p.id === item.product_id); // Find the corresponding product

        // Check if the product is out of stock
        const isOutOfStock = product?.stock_status === "outofstock";

        // If the product is out of stock, return null or skip it
        if (isOutOfStock) {
          return null;
        }

        return {
          product_id: item?.product_id,
          quantity: item?.quantity,
          name: product?.name,
          slug: product?.slug,
          permalink: product?.permalink,
          price: product?.price,
          categories: product?.categories,
          image: product?.images[0]?.src, // Get the first image if available
          isNeedLicence: item?.isNeedLicence,
          category: item?.category,
          sub_category: item?.sub_category,
          child_category: item?.child_category,
        };
      })
      .filter(Boolean); // Filter out any null values (out of stock items)

  useEffect(() => {
    const outOfStock = cartItems.filter((item) => {
      const product = cartListedItems.find((p) => p.id === item.product_id);
      return product?.stock_status === "outofstock";
    });

    if (outOfStock.length > 0) {
      setOutOfStockItems(outOfStock);

      // Remove out-of-stock items from localStorage
      const updatedCartItems = cartItems.filter((item) => {
        const product = cartListedItems.find((p) => p.id === item.product_id);
        return product?.stock_status !== "outofstock";
      });

      // Update cartItems state and localStorage
      setCartItems(updatedCartItems);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          `${siteName}_cart`,
          JSON.stringify(updatedCartItems)
        );
      }
    }
  }, [cartItems, cartListedItems]);

  return (
    <>
      {/* Show message for out-of-stock items */}
      {outOfStockItems.length > 0 && (
        <Alerts status="red" stock data={outOfStockItems && outOfStockItems} />
      )}

      {/* Render remaining cart items */}
      <ul className="added-cart-list">
        {mergedCart &&
          mergedCart.map((item, index) => (
            <li
              key={index}
              className={` ${
                item?.isNeedLicence === 1 ? "!border-red-300 border" : ""
              }  !pb-0`}
            >
              <div
                className={`lg:flex items-center justify-start w-full gap-5 pb-5  ${
                  item?.isNeedLicence === 1 ? "px-5 pb-5" : ""
                }`}
              >
                <div className="flex items-center justify-start w-full gap-5 mb-7 lg:mb-0">
                  <Link
                    className="flex items-center sm:h-[60px] sm:w-[60px] h-[80px] w-[80px] min-h-[80px] min-w-[80px] sm:p-3 p-1"
                    href={`${homeUrl}${locale}/products/${item?.category}/${item?.sub_category}/${item?.child_category}/${item?.slug}`}
                  >
                    <Images
                      imageurl={item?.image}
                      quality="100"
                      width="100"
                      height="100"
                      title={item?.name || "Product"}
                      alt={item?.name || "Product"}
                      classes="sm:min-h-[70px] sm:min-w-[70px] min-h-[50px] min-w-[50px] block mx-auto object-contain"
                      placeholder={true}
                    />
                  </Link>
                  <div className="w-full grid items-center">
                    <Link
                      href={`${homeUrl}${locale}/products/${item?.category}/${item?.sub_category}/${item?.child_category}/${item?.slug}`}
                    >
                      <h3 className="product-title font-semibold sm:font-medium mb-1">
                        {item?.name}
                      </h3>
                    </Link>
                    {item?.price && (
                      <div>
                        <div>
                          <span className="product-price text-sm opacity-70">
                            <div className="flex items-center gap-1">
                              <Price small regular={item?.price} sale="" />x{" "}
                              {item?.quantity}
                              {getTranslation(
                                translation[0]?.translations,
                                "items",
                                locale || "en"
                              )}
                            </div>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {item && (
                  <AddToCart
                    inCartPage
                    itemid={item?.product_id ?? null}
                    price={item?.price && item?.price}
                    name={item?.name && item?.name}
                    image={item?.image && item?.image}
                    item={item?.product_id}
                    options={
                      (item?.option &&
                        convertStringToJSON(item && item?.option)) ||
                      item?.price
                    }
                    category={item?.category}
                    subCategory={item?.sub_category}
                    childCategory={item?.child_category}
                  />
                )}
              </div>
              {item?.isNeedLicence === 1 && (
                <div className="border-t border-red-300 bg-red-300 bg-opacity-10 text-xs p-2">
                  <i className="bi bi-exclamation-triangle-fill text-red-500 mr-1 text-[11px] mb-1"></i>
                  <span className="uppercase text-red-500 font-medium px-2">
                    {getTranslation(
                      translation[0]?.translations,
                      "Before You Buy.",
                      locale || "en"
                    )}
                  </span>
                  {getTranslation(
                    translation[0]?.translations,
                    "I understand that identification will be required for collection of this restricted item.",
                    locale || "en"
                  )}
                </div>
              )}
            </li>
          ))}
      </ul>
    </>
  );
}
