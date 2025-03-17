"use client";

import Link from "next/link";
import Images from "./Images";
import Search from "./Search";
import {
  getTranslation,
  homeUrl,
  siteLogo,
  siteName,
} from "../Utils/variables";
import { useEffect, useRef, useState } from "react";
import Nav from "./Nav";

import Accordion from "./Accordion";
import { useSiteContext } from "../Context/siteContext";
import LanguageSwitcher from "./LangaugeSwitch";
import { useAuthContext } from "../Context/authContext";
import Logout from "./Logout";
import { useCartContext } from "../Context/cartContext";
import DispatchTime from "./DispatchTime";
import { useLanguageContext } from "../Context/LanguageContext";
import Skelton from "./Skelton";

export default function Header({ locale }) {
  const {
    showMegaMenu,
    setShowMegaMenu,
    showNavCatItem,
    currencies,
    setActiveCurrency,
    activeCurrency,
    headerMenu,
    searchMobileVisible,
    setSearchMobileVisible,
  } = useSiteContext();

  const { validUserTocken } = useAuthContext();
  const { cartItems } = useCartContext();

  const { translation } = useLanguageContext();

  const [visibleDiv, setVisibleDiv] = useState("");

  const [isVisible, setIsVisible] = useState(true); // To track header visibility
  const [lastScrollY, setLastScrollY] = useState(0); // To track last scroll position
  const [isSticky, setIsSticky] = useState(false); // To track if header is sticky

  const [headerHeight, setHeaderHeight] = useState(0);
  const [loading, setLoading] = useState(true);

  const headerRef = useRef(null);

  const updateHeight = () => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    updateHeight();

    if (topLevelItems) {
      setLoading(false);
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [headerMenu]); // Empty dependency array means this effect runs only once on mount

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      // Ensure that window is defined
      if (window.scrollY > lastScrollY && window.scrollY > 200) {
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      if (window.scrollY > 400) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      setLastScrollY(window.scrollY); // Update the last scroll position
    }
  };

  useEffect(() => {
    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]); // Dependency array with lastScrollY to re-trigger on scroll

  const savedMenuInLocalStorage =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(`${siteName}_menu`))
      : null;

  const topLevelItems = savedMenuInLocalStorage?.items?.filter(
    (item) => item.parent === "0"
  );

  function buildHierarchy(data) {
    const hierarchy = {};

    // Create a map of items by their id
    const map = data?.reduce((acc, item) => {
      acc[item.id] = { ...item, children: [] };
      return acc;
    }, {});

    // Build the hierarchy based on the parent-child relationships
    data?.forEach((item) => {
      if (item.parent === "0") {
        // Top level (parent === 0)
        hierarchy[item.id] = map[item.id];
      } else {
        // Attach to the correct parent
        if (map[item.parent]) {
          map[item.parent].children.push(map[item.id]);
        }
      }
    });

    return hierarchy;
  }

  function filterByTitle(hierarchy, searchTitle) {
    let result = [];

    // Loop through the hierarchy and filter based on title
    for (let key in hierarchy) {
      const item = hierarchy[key];

      // Check if the title matches the search string (case-insensitive)
      if (item.title.toLowerCase().includes(searchTitle.toLowerCase())) {
        result.push(item);
      }

      // Recursively filter children
      const filteredChildren = filterChildren(item.children, searchTitle);
      if (filteredChildren.length > 0) {
        result.push({
          ...item,
          children: filteredChildren,
        });
      }
    }

    return result;
  }

  function filterChildren(children, searchTitle) {
    let filteredChildren = [];

    children?.forEach((child) => {
      if (child.title.toLowerCase().includes(searchTitle.toLowerCase())) {
        filteredChildren.push(child);
      }

      // Recursively filter the child's children
      const filteredSubChildren = filterChildren(child.children, searchTitle);
      if (filteredSubChildren.length > 0) {
        filteredChildren.push({
          ...child,
          children: filteredSubChildren,
        });
      }
    });

    return filteredChildren;
  }

  const organizedData = buildHierarchy(
    headerMenu || (savedMenuInLocalStorage && savedMenuInLocalStorage)
      ? savedMenuInLocalStorage?.items
      : headerMenu?.items
  );

  useEffect(() => {
    setVisibleDiv(showNavCatItem); // Set the visible div based on the active value
  }, [showNavCatItem]);

  const handleClick = () => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
  };

  return (
    <header
      className={`transition-all z-20 ${
        isSticky && "sticky-header"
      } bg-white transition-all sticky top-0 left-0 right-0 z-[99]`}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(-100%)", // Hide on scroll down
      }}
      ref={headerRef}
    >
      <div className="bg-primary uppercase [&>*]:text-xs py-1 sm:py-0">
        <div className="container flex justify-between items-center">
          <small className="block text-white sm:text-xs text-[10px]">
            {getTranslation(
              translation[0]?.translations,
              "Next Dispatch",
              locale || "en"
            )}
            <span className="text-primary-hover text-xs px-1">|</span>{" "}
            <DispatchTime />
          </small>
          <div className="flex">
            <div className="sm:pr-3 pr-1 flex items-center">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  className=" sm:p-2 p-1 text-white flex gap-1 items-center justify-center sm:text-xs text-[10px]"
                  role="button"
                >
                  {activeCurrency}
                  <i className="bi bi-chevron-down sm:text-xs text-[10px]"></i>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  {currencies &&
                    currencies?.map((item, index) => (
                      <li
                        key={index}
                        onClick={handleClick}
                        onTouchStart={handleClick}
                      >
                        <button
                          className=""
                          onClick={(e) => {
                            setActiveCurrency(item?.title?.rendered),
                              typeof window !== "undefined" &&
                                localStorage.setItem(
                                  `${siteName}_currency`,
                                  item?.title?.rendered
                                ),
                              typeof window !== "undefined" &&
                                localStorage.setItem(
                                  `${siteName}_currency_symbol`,
                                  item?.acf?.symbol
                                );
                          }}
                          onTouchStart={(e) => {
                            setActiveCurrency(item?.title?.rendered),
                              typeof window !== "undefined" &&
                                localStorage.setItem(
                                  `${siteName}_currency`,
                                  item?.title?.rendered
                                ),
                              typeof window !== "undefined" &&
                                localStorage.setItem(
                                  `${siteName}_currency_symbol`,
                                  item?.acf?.symbol
                                );
                          }}
                        >
                          {item?.title?.rendered}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="lang-col">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      <div className="sm:pt-4 pt-3  bg-white border-b border-border">
        {!showMegaMenu && (
          <div className="container mb-4">
            <div className="flex items-center justify-between sm:gap-[30px] gap-[20px]">
              <div className="logo">
                <Link href={`${homeUrl}${locale}`}>
                  <Images
                    imageurl={siteLogo}
                    quality="100"
                    width="150"
                    height="50"
                    title={siteName}
                    alt={siteName}
                    classes="block w-full sm:h-[70px] min-w-[100px] object-contain"
                    placeholder={true}
                  />
                </Link>
              </div>
              <div className="flex justify-between w-full">
                <div className="hidden lg:flex w-full items-center justify-center">
                  <Nav
                    locale={locale}
                    header
                    data={headerMenu && headerMenu?.items}
                  />
                </div>
                <div className="w-full lg:w-auto flex items-center justify-end  gap-6">
                  {/* SEARCH ICON */}
                  <svg
                    onClick={(e) =>
                      setSearchMobileVisible(!searchMobileVisible)
                    }
                    onTouchStart={(e) =>
                      setSearchMobileVisible(!searchMobileVisible)
                    }
                    className="cursor-pointer hover:opacity-30 transition-all"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="#000"
                      strokeLinecap="square"
                      d="m19 18.658-5.71-5.71m-5.09 2.11a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z"
                    />
                  </svg>

                  {validUserTocken ? (
                    <div className="dropdown dropdown-bottom dropdown-end">
                      <svg
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer hover:opacity-30 transition-all"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="#000"
                          strokeLinecap="square"
                          d="M1 19.158a8.182 8.182 0 0 1 8.182-8.182h1.636A8.182 8.182 0 0 1 19 19.158"
                        />
                        <path
                          stroke="#000"
                          strokeLinecap="square"
                          d="M10 10.976a4.91 4.91 0 1 0 0-9.818 4.91 4.91 0 0 0 0 9.818Z"
                        />
                      </svg>

                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                      >
                        {validUserTocken && (
                          <>
                            <li
                              onClick={handleClick}
                              onTouchStart={handleClick}
                            >
                              <Link href={`${homeUrl}${locale}/account`}>
                                {getTranslation(
                                  translation[0]?.translations,
                                  "Account",
                                  locale || "en"
                                )}
                              </Link>
                            </li>
                            <li
                              onClick={handleClick}
                              onTouchStart={handleClick}
                            >
                              <Logout small />
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      href={`${homeUrl}${locale}/auth/login?mainLogin=true`}
                    >
                      <svg
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer hover:opacity-30 transition-all"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="#000"
                          strokeLinecap="square"
                          d="M1 19.158a8.182 8.182 0 0 1 8.182-8.182h1.636A8.182 8.182 0 0 1 19 19.158"
                        />
                        <path
                          stroke="#000"
                          strokeLinecap="square"
                          d="M10 10.976a4.91 4.91 0 1 0 0-9.818 4.91 4.91 0 0 0 0 9.818Z"
                        />
                      </svg>
                    </Link>
                  )}

                  <Link
                    href={`${homeUrl}${locale}/account/wishlist`}
                    className="hidden sm:block"
                  >
                    <svg
                      className="cursor-pointer hover:opacity-30 transition-all"
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="19"
                      fill="none"
                      viewBox="0 0 21 19"
                    >
                      <path
                        stroke="#000"
                        d="M10.365 17.658a1.004 1.004 0 0 1-.53-.16c-2.694-1.663-4.721-3.308-6.376-5.187a10.243 10.243 0 0 1-2.153-3.498c-.854-2.52.131-5.464 2.296-6.85a4.949 4.949 0 0 1 6.355.823c.146.157.28.322.408.484.175-.225.362-.439.563-.64a5.056 5.056 0 0 1 1.689-1.113 4.889 4.889 0 0 1 3.908.095 4.952 4.952 0 0 1 1.592 1.18c1.685 1.844 2.084 4.081 1.113 6.47a10.766 10.766 0 0 1-2.134 3.232 27.308 27.308 0 0 1-5.32 4.439c-.262.174-.533.343-.8.508l-.08.051c-.16.104-.343.161-.53.166Z"
                      />
                    </svg>
                  </Link>

                  <Link href={`${homeUrl}${locale}/cart`}>
                    <div className="relative cursor-pointer hover:opacity-30 transition-all">
                      <span className="bg-primary text-white rounded-full size-[20px] inline-flex text-xs font-normal items-center justify-center absolute -right-2 -top-2">
                        {cartItems?.length}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="20"
                        fill="none"
                        viewBox="0 0 22 20"
                      >
                        <path
                          stroke="#000"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M15 5.158a4 4 0 1 0-8 0m-6 3h20l-4 11H5l-4-11Z"
                        />
                      </svg>
                    </div>
                  </Link>
                  <svg
                    onClick={(e) => {
                      setShowMegaMenu(!showMegaMenu),
                        (document.body.style.overflow = "hidden");
                    }}
                    className="lg:hidden cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="14"
                    fill="none"
                    viewBox="0 0 20 14"
                  >
                    <path stroke="#000" d="M0 1.396h20m-20 6h20m-20 6h20" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH START */}
        {searchMobileVisible && (
          <div>
            <Search />
          </div>
        )}
        {/* MEGA MENU START */}
        <div
          style={{
            top: !showMegaMenu ? `${headerHeight}px` : 0,
          }}
          className={`${
            showMegaMenu
              ? "h-auto w-full"
              : "sm:h-[0px] sm:w-full w-[0px] bg-emerald-300 !p-0 !min-h-0 overflow-hidden"
          } mega-menu  pt-5 pb-1  transition-all `}
        >
          <div className="container grid sm:gap-8 gap-5">
            {showMegaMenu && (
              <svg
                onClick={(e) => {
                  setShowMegaMenu(!showMegaMenu),
                    (document.body.style.overflow = "auto");
                }}
                className="close-nav"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="13"
                fill="none"
                viewBox="0 0 14 13"
              >
                <path
                  stroke="#fff"
                  d="M13.5.5 7.25 6.75m0 0L1.5 12.5m5.75-5.75L13 12.5M7.25 6.75 1 .5"
                />
              </svg>
            )}
            {loading ? (
              <Skelton menu />
            ) : (
              headerMenu &&
              topLevelItems?.map((category, index) => (
                <div
                  key={index}
                  data-name={category?.title
                    ?.toLowerCase()
                    ?.replace(/\s+/g, "-")}
                  className={`${
                    category?.title?.toLowerCase()?.replace(/\s+/g, "-") ===
                    visibleDiv
                      ? "block"
                      : ""
                  } md:border-none md:pb-0`}
                >
                  <Link
                    onClick={(e) => setShowMegaMenu(!showMegaMenu)}
                    onTouchStart={(e) => setShowMegaMenu(!showMegaMenu)}
                    href={`${homeUrl}${locale}/products/${category?.url
                      ?.split("/")
                      .filter(Boolean)
                      .pop()}/`}
                    className="primary-font text-primary mb-0 block text-[18px]"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          locale === "en"
                            ? category?.url
                                ?.split("/")
                                .filter(Boolean)
                                .pop()
                                ?.replace(/-/g, " ")
                            : category?.acf?.arabic,
                      }}
                    />
                  </Link>
                  <div className="lg:flex  lg:flex-wrap md:gap-12 gap-2 justify-start w-full">
                    {headerMenu &&
                      filterByTitle(
                        organizedData,
                        category?.title
                      )[0]?.children?.map((subCategory, subIndex) => (
                        <div
                          key={subIndex}
                          className="sub-category-item w-full border-b border-border py-5 pb-5"
                        >
                          <div className="lg:flex flex-wrap md:gap-12 gap-2 justify-start">
                            <div className="min-w-[200px] w-full sm:w-auto ">
                              <div>
                                {/* {subCategory?.children.length !== 0 ? 'yes' : 'no'} */}
                                {subCategory?.children?.length !== 0 ? (
                                  <Accordion
                                    navigation
                                    items={[
                                      {
                                        title:
                                          locale === "en"
                                            ? subCategory?.url
                                                ?.split("/")
                                                .filter(Boolean)
                                                .pop()
                                                ?.replace(/-/g, " ")
                                            : subCategory?.acf?.arabic,
                                        mainCat: category?.title || "#",
                                        content: subCategory?.children.map(
                                          (childCategory, childIndex) => ({
                                            text:
                                              locale === "en"
                                                ? childCategory?.url
                                                    ?.split("/")
                                                    .filter(Boolean)
                                                    .pop()
                                                : childCategory?.acf?.arabic,
                                            link: `${homeUrl}${locale}/products/${category?.url
                                              ?.split("/")
                                              .filter(Boolean)
                                              .pop()}/${
                                              subCategory?.url
                                                ?.split("/")
                                                .slice(-2, -1)[0]
                                            }/${
                                              childCategory?.url
                                                ?.split("/")
                                                .slice(-2, -1)[0]
                                            }`,
                                          })
                                        ),
                                      },
                                    ]}
                                  />
                                ) : (
                                  <Link
                                    onClick={(e) => setShowMegaMenu(false)}
                                    href={`${homeUrl}${locale}/products/${category?.url
                                      ?.split("/")
                                      .filter(Boolean)
                                      .pop()}/${subCategory?.url
                                      ?.split("/")
                                      .filter(Boolean)
                                      .pop()}/`}
                                    className="w-full uppercase primary-font text-primary leading-[1.5em]  text-left font-medium transition-all  flex items-center justify-between"
                                  >
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          locale === "en"
                                            ? subCategory?.url
                                                ?.split("/")
                                                .filter(Boolean)
                                                .pop()
                                                ?.replace(/-/g, " ")
                                            : subCategory?.acf?.arabic,
                                      }}
                                    />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
          <img
                    src={`${homeUrl}images/brand-bg-large.webp`}
                    title={siteName}
                    alt={siteName}
                    className="block w-full object-contain mt-10"
                  />
        </div>

        {showMegaMenu && (
          <div
            className="backdrop-megamenu cursor-pointer absolute"
            onClick={(e) => {
              setShowMegaMenu(!showMegaMenu);
            }}
            onTouchStart={(e) => {
              setShowMegaMenu(!showMegaMenu);
            }}
          ></div>
        )}
        {/* MEGA MENU END */}
      </div>
    </header>
  );
}
