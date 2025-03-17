"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { homeUrl, siteName } from "../Utils/variables";
import Skelton from "./Skelton";
import { usePathname } from "next/navigation";

export default function Nav({ data, locale }) {
  const pathname = usePathname();

  const savedMenuInLocalStorage =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(`${siteName}_menu`))
      : null;

  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [menuData, setMenuData] = useState(
    savedMenuInLocalStorage?.items || data
  );

  useEffect(() => {
    // Only update menuData if it has changed
    if (
      savedMenuInLocalStorage &&
      JSON.stringify(savedMenuInLocalStorage) !== JSON.stringify(menuData)
    ) {
      setMenuData(savedMenuInLocalStorage);
    } else if (
      !savedMenuInLocalStorage &&
      data &&
      JSON.stringify(data) !== JSON.stringify(menuData)
    ) {
      setMenuData(data);
    }

    // Set loading to false when data or saved menu is available
    if (savedMenuInLocalStorage || data) {
      setLoading(false);
    }
  }, [data, savedMenuInLocalStorage, menuData]); // Added menuData to dependency array

  // Function to transform data into a hierarchical structure
  function buildNavTree(data) {
    const map = {};
    const roots = [];

    if (data?.items) {
      data &&
        data?.items.forEach((item) => {
          map[item.id] = { ...item, children: [] };
        });

      // Build the hierarchy
      data &&
        data?.items.forEach((item) => {
          if (item.parent === "0") {
            roots.push(map[item.id]); // Root-level items (no parent)
          } else {
            if (map[item.parent]) {
              map[item.parent].children.push(map[item.id]);
            }
          }
        });
    }

    return roots;
  }

  const navTree = buildNavTree(menuData);

  // Function to render the menu dynamically
  const renderMenu = (items, parentUrl = "") => {
    return (
      <ul className={`${clicked ? "clicked" : ""} NavMenu`}>
        {items.map((item) => {
          // Build the URL for each item dynamically

          let url = `${item?.url}/`;

          let cleanUrl = url.replace(/\/+$/, "");

          let itemName = cleanUrl.split("/").pop();

         // console.log(parentUrl)

          const itemUrl =
            item?.acf?.custom_url !== ""
              ? `${homeUrl}${locale}${item?.acf?.custom_url}`
              : `${homeUrl}${locale}/products/${parentUrl}${itemName}/`;

          return (
            <li
              key={item.id}
              className="nav-item"
              onClick={(e) => setClicked(!clicked)}
            >
              <Link href={itemUrl} className="nav-link">
                <span
                  dangerouslySetInnerHTML={{
                    __html: locale === "en" ? item?.title : item?.acf?.arabic,
                  }}
                />
              </Link>
              {/* Render children if they exist, passing the current item URL as the parent */}

              
              {item.children &&
                item.children.length > 0 &&
                renderMenu(
                  item.children,
                  `${parentUrl}${item?.url.split('/').filter(Boolean).pop()}/`
                )}
            </li>
          );
        })}
      </ul>
    );
  };

  useEffect(() => {
    setClicked(false);
  }, [pathname]);

  return <nav>{loading ? <Skelton nav /> : renderMenu(navTree)}</nav>;
}
