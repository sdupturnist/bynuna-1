"use client";

import { useState } from "react";
import Filter from "./Filter";
import { useSiteContext } from "../Context/siteContext";
import { useRouter } from "nextjs-toploader/app";
import { getTranslation, siteName } from "../Utils/variables";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams } from "next/navigation";

export default function PageHeader({
  title,
  account,
  data,
  filter,
  sortProducts,
  filterData,
  activeFilterMetas,
  
}) {
  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 

  const { showFilter, setShowFilter } = useSiteContext();


  const { translation } = useLanguageContext();

  //SORT

  const [selectedSort, setSelectedSort] = useState({
    item: "",
    type: "",
  });

  const sort = (item, type) => {
    const elem = document.activeElement;
    if (elem) {
      elem.blur();
    }

    setSelectedSort({ item, type });

    const currentQuery = new URLSearchParams(window.location.search);
    currentQuery.set("sortby", item);
    currentQuery.set("sortVal", type);

    const newUrl = `${window.location.pathname}?${currentQuery.toString()}`;

    router.push(newUrl, undefined, { shallow: true });
  };

  const isSelected = (item, type) => {
    return selectedSort.item === item && selectedSort.type === type;
  };

  if (filter) {
    return (
      <>
        <div className="bg-white border-b border-border sm:py-5 py-3 relative">
          <div className="container flex justify-between items-center">
            {
              <>
                {sortProducts && (
                  <div className="order-1">
                    <div className="dropdown uppercase">
                      <div
                        tabIndex={0}
                        role="button"
                        className="primary-font text-xs"
                      >
                        {getTranslation(
                          translation[0]?.translations,
                          "Sort",
                          locale || 'en'
                        )}

                        <i className="bi bi-chevron-down ml-2"></i>
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-0 shadow"
                      >
                        <li
                          className={`${
                            isSelected("name", "asc")
                              ? "bg-primary text-white"
                              : ""
                          }`}
                        >
                          <button
                            onClick={() => sort("name", "asc")}
                            className="font-primary px-2 text-xs py-3"
                          >
                            {getTranslation(
                              translation[0]?.translations,
                              "Alphabetically, A - z",
                              locale || 'en'
                            )}
                          </button>
                        </li>
                        <li
                          className={`${
                            isSelected("name", "desc")
                              ? "bg-primary text-white"
                              : ""
                          }`}
                        >
                          <button
                            onClick={() => sort("name", "desc")}
                            className="font-primary px-2 text-xs py-3"
                          >
                            {getTranslation(
                              translation[0]?.translations,
                              "Alphabetically, z-a",
                              locale || 'en'
                            )}
                          </button>
                        </li>
                        <li
                          className={`${
                            isSelected("price", "asc")
                              ? "bg-primary text-white"
                              : ""
                          }`}
                        >
                          <button
                            onClick={() => sort("price", "asc")}
                            className="font-primary px-2 text-xs py-3"
                          >
                            {getTranslation(
                              translation[0]?.translations,
                              "Price low to high",
                              locale || 'en'
                            )}
                          </button>
                        </li>
                        <li
                          className={`${
                            isSelected("price", "desc")
                              ? "bg-primary text-white"
                              : ""
                          }`}
                        >
                          <button
                            onClick={() => sort("price", "desc")}
                            className="font-primary px-2 text-xs py-3"
                          >
                            {getTranslation(
                              translation[0]?.translations,
                              "Price high to low",
                              locale || 'en'
                            )}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                <div className="order-2">
                  <h1 className="sm:text-lg text-sm font-bold text-center uppercase w-fit px-4 mx-auto">
                    {getTranslation(
                      translation[0]?.translations,
                      title.replace(/-/g, ' '),
                      locale || 'en'
                    )}
                  </h1>
                </div>
                <div className="order-3">
                  <div
                    onClick={(e) => setShowFilter(!showFilter)}
                    className="primary-font text-xs uppercase cursor-pointer"
                  >
                    {getTranslation(
                      translation[0]?.translations,
                      "Filter",
                      locale || 'en'
                    )}
                  </div>
                </div>
              </>
            }
          </div>
        </div>

        {/* FILTER  */}
        {showFilter && (
          <Filter
            activeFilterMetas={activeFilterMetas}
            filterData={filterData}
            shopPageLevel={filter}
          />
        )}
      </>
    );
  }

  if (account) {
    return (
      <div className="bg-white border-b border-border sm:py-5 py-3">
        <div className="container flex justify-between">
          <h1 className="sm:text-lg text-lg font-bold text-center uppercase">
            {getTranslation(translation[0]?.translations, title, locale || 'en')}
          </h1>
          <p className="primary-font">
            {getTranslation(translation[0]?.translations, "Hello", locale || 'en')}
            <span className="px-2">
            {data?.first_name || ""}
            </span>
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-white border-b border-border sm:py-7 py-3">
        <h1 className="sm:text-2xl text-lg font-bold text-center uppercase">
          {getTranslation(translation[0]?.translations, title, locale || 'en')}
        </h1>
      </div>
    );
  }
}
