"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSiteContext } from "../Context/siteContext";
import { apiUrl, getTranslation, homeUrl, siteName } from "../Utils/variables";
import Accordion from "./Accordion";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useParams, useRouter } from "next/navigation";
import { useLanguageContext } from "../Context/LanguageContext";

export default function Filter({
  shopPageLevel,
  filterData,
  activeFilterMetas,
}) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { translation } = useLanguageContext();

  const {
    showFilter,
    setShowFilter,
    subCategories,
    childCategories,
    selectedFilters,
    setSelectedFilters,
    setPrice,
  } = useSiteContext();

  const [value, setValue] = useState([0, 1000000]);
  const { queryUpdated, setQueryUpdated } = useSiteContext();
  const [filterLabel, setFilterLabel] = useState([]);

  const isUpdatingRef = useRef(false);

  //PRICE

  const isInitialRender = useRef(true); // To prevent updating the URL on the initial render

  // Function to handle the input change for either min or max price
  const handleInputChange = (index, newValue) => {
    const newValues = [...value];
    newValues[index] = Math.min(Math.max(newValue, 0), 1000000); // Clamp between 0 and 100000
    setValue(newValues); // Update the state with the new values
  };

  // useLayoutEffect(() => {
  //   console.log("layout effect");
  // });

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return; // Skip URL update on the first render
    }

    const currentQuery = new URLSearchParams(window.location.search);
    currentQuery.set("max_price", value[1]);
    currentQuery.set("min_price", value[0]);

    // Update the URL with shallow routing
    router.push(
      `${window.location.pathname}?${currentQuery.toString()}`,
      undefined,
      { shallow: true }
    );
  }, [value, router]); // Runs whenever `value` changes

  // REMOVE SELECTED FILTER ITEM

  // Function to update the URL with selected filters
  const updateURL = (filters) => {
    const currentQuery = new URLSearchParams(window.location.search);

    // Remove previous filters
    currentQuery.delete("filter_items");

    // Format filters into the desired structure
    const filterString = filters
      .map((filter) => `${filter?.text?.en}~:${filter?.text?.en}`)
      .join("|"); // Join multiple filters with '|'

    // Append the new filter as a single _filter_items key
    currentQuery.append("filter_items", filterString);

    // Push the updated URL to the router
    router.push(
      `${window.location.pathname}?${currentQuery.toString()}`,
      undefined,
      { shallow: true }
    );
  };

  const removeFilter = (item) => {
    setSelectedFilters((prevFilters) => {
      // Check if the item is already in the filters array
      const isItemSelected = prevFilters.includes(item);

      // Update the filter list based on whether the item is selected
      const updatedFilters = isItemSelected
        ? prevFilters.filter((filter) => filter !== item) // Remove if already selected
        : [...prevFilters, item]; // Add if not selected

      // Avoid setting state during render, use ref to delay URL update
      if (!isUpdatingRef.current) {
        isUpdatingRef.current = true; // Mark the update as in progress

        setTimeout(() => {
          updateURL(updatedFilters);
          isUpdatingRef.current = false; // Reset the flag after the update
        }, 300); // Wait for 300ms before updating the URL
      }

      return updatedFilters;
    });
  };

  // CLEAR ALL FILTERS
  const clearAllFilters = () => {
    setSelectedFilters([]);
    setQueryUpdated(true);
    //localStorage.removeItem(`${siteName}_selectedFilters`);
  };

  useEffect(() => {
    if (!queryUpdated) return;

    const currentQuery = new URLSearchParams(window.location.search);

    if (selectedFilters.length === 0) {
      currentQuery.delete("filter_items");
    } else {
      currentQuery.delete("filter_items");
      if (Array.isArray(selectedFilters)) {
        selectedFilters &&
          selectedFilters?.forEach((filter) => {
            currentQuery.append("filter_items");
            currentQuery.append(
              "filter_items",
              locale === "en"
                ? filter?.en
                : filter?.ar
                ? filter?.ar
                : filter?.en
            );
          });
      }
    }

    router.push(
      `${window.location.pathname}?${currentQuery.toString()}`,
      undefined,
      { shallow: true }
    );

    setQueryUpdated(false);
  }, [selectedFilters, queryUpdated, router]);

  // First, filter out unwanted labels ("color" and "blade-style")

  const filteredData = filterData.filter(
    (entry) =>
      !entry.val.startsWith("Color~:") &&
      !entry.val.startsWith("color~:") &&
      !entry.val.startsWith("Colour~:") &&
      !entry.val.startsWith("Blade Shape~:") &&
      !entry.val.startsWith("Blade shape~:")
  );

  // Helper function to extract label from value
  const extractLabel = (str) => str.split("~:")[0];

  // Group values by labels
  const groupedData = [];
  filteredData.forEach((item) => {
    const label = extractLabel(item.val);
    // Check if label already exists in the grouped data
    let labelGroup = groupedData.find((group) => group.label === label);
    if (!labelGroup) {
      // If the label doesn't exist, create a new group
      labelGroup = { label: label, value: [] };
      groupedData.push(labelGroup);
    }
    // Add the value to the corresponding label group, updating the structure
    labelGroup.value.push({ val_label: item.val });
  });

  const hasColor = filterData.some(
    (entry) =>
      entry.val.includes("Colour") && entry.val.split("|")[0].includes("Colour")
  );

  const colorItems = filterData.filter((entry) => entry.val.includes("Colour"));

  const hasBladetype = filterData.some(
    (entry) =>
      entry.val.includes("Blade Shape") &&
      entry.val.split("|")[0].includes("Blade Shape")
  );

  const bladeItems = filterData.filter((entry) =>
    entry.val.includes("Blade Shape")
  );

  const closeFilter = () => {
    setShowFilter(!showFilter);
    document.body.style.overflow = "auto";
  };

  //GET FILTER LABEL TRANSALATION
  const fetchFilters = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wp/v2/filter?per_page=99`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setFilterLabel(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, [filterData]);

  // console.log(filterLabel)
  function filterByTitle(filters, title) {
    // Filter the filters array by the title and extract the `acf.arabic` value
    const filtered = filters?.filter(
      (filter) => filter?.title?.rendered === title
    );

    // Return the `acf.arabic` value for each filtered result
    return filtered.map((filter) => filter?.acf?.arabic);
  }

  if (
    shopPageLevel === "subcategory" ||
    shopPageLevel === "category" ||
    shopPageLevel === "brand"
  ) {
    return (
      <div className="filter ">
        <div className="bg-white ">
          <div className="header py-4 border-b border-border">
            <div className="px-5 flex justify-between">
              <h4 className="heading-sm uppercase text-center w-full">
                {getTranslation(
                  translation[0]?.translations,
                  "Filters",
                  locale || "en"
                )}
              </h4>
              <div
                className="size-7 flex items-center justify-center"
                onClick={closeFilter}
              >
                <i className="bi bi-x-lg cursor-pointer"></i>
              </div>
            </div>
          </div>
          <div className="max-h-screen min-h-screen overflow-auto p-5">
            <div>
              {/* FILTERED ITEMS */}
              {selectedFilters?.length > 0 && (
                <div className="pb-4 border-b border-border grid gap-3">
                  <div className="primary-font text-sm uppercase">
                    {getTranslation(
                      translation[0]?.translations,
                      "Filtered By",
                      locale || "en"
                    )}
                  </div>
                  <ul className="filtered-items">
                  
                    {selectedFilters &&
                      selectedFilters.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-[11px] uppercase pl-1 leading-4 inline-block whitespace-break-spaces">
                           {item.split("~:")[0]} :  {locale === "en"
                              ? item.split("~:")[1].split("|")[0]
                              : item?.split("|")[1]
                              ? item?.split("|")[1]
                              : item.split("~:")[1].split("|")[0]}
                          </span>

                          <i
                            className="bi bi-x cursor-pointer text-[15px] mr-1 ml-1"
                            onClick={() => removeFilter(item)}
                          />
                        </li>
                      ))}
                  </ul>

                  <button className="btn" onClick={clearAllFilters}>
                    Clear all
                  </button>
                </div>
              )}

              <div>
                {subCategories && (
                  <Accordion
                    filter
                    filterLink
                    items={[
                      {
                        title: "category",
                        content: subCategories?.map((item, childIndex) => ({
                          text:
                            locale === "en"
                              ? item?.title?.rendered
                              : item?.acf?.title_arabic
                              ? item?.acf?.title_arabic
                              : item?.title?.rendered,
                          link: item?.slug,
                          levels: "",
                        })),
                      },
                    ]}
                  />
                )}
              </div>

              {/* PRICE */}
              <div className="grid gap-4 mt-4 pb-4 border-b border-border">
                <span className="primary-font sm:text-[14px] font-semibold !text-xs uppercase">
                  {getTranslation(
                    translation[0]?.translations,
                    "Price",
                    locale || "en"
                  )}
                </span>

                <RangeSlider
                  value={value} // Value of the range slider (min and max price)
                  step={500}
                  min={0}
                  max={1000000}
                  onInput={(newValue) => setValue(newValue)} // Update state when range slider is adjusted
                />

                <div className="join w-full">
                  <input
                    type="number"
                    value={value[0]} // Min price value
                    onChange={
                      (e) => handleInputChange(0, parseInt(e.target.value)) // Pass index 0 for min price
                    }
                    min={0}
                    max={value[1]} // Max of the first input should not exceed the second input (max price)
                    className="join-item input text-center !max-h-[40px] !min-h-[40px] w-full"
                  />
                  <input
                    type="number"
                    value={value[1]} // Max price value
                    onChange={
                      (e) => handleInputChange(1, parseInt(e.target.value)) // Pass index 1 for max price
                    }
                    min={value[0]} // Min of the second input should not be less than the first input (min price)
                    max={100000} // Max is fixed at 100,000
                    className="join-item input text-center !max-h-[40px] !min-h-[40px] w-full"
                  />
                </div>
              </div>

              {/* COLOR */}
              {hasColor && (
                <Accordion
                  filter
                  filterGraphic
                  items={[
                    {
                      title: getTranslation(
                        translation[0]?.translations,
                        "Color",
                        locale || "en"
                      ),
                      content: colorItems.map((item, childIndex) =>
                        //console.log(item?.val?.split('~:')[1].split('|')[0])

                        ({
                          text: item?.val,
                          id: item?.id,
                          item: item?.item,
                        })
                      ),
                    },
                  ]}
                />
              )}

              {/* BLADE STYLE */}
              {hasBladetype && (
                <Accordion
                  filter
                  filterGraphic
                  items={[
                    {
                      title: getTranslation(
                        translation[0]?.translations,
                        "Blade shape",
                        locale || "en"
                      ),
                      content: bladeItems.map((item, childIndex) => ({
                        text: item?.val,
                        id: item?.id,
                        item: item?.item,
                      })),
                    },
                  ]}
                />
              )}

              {groupedData &&
                groupedData.map((item, index) => (
                  //console.log('vvv', filterByTitle(filterLabel, item?.label)[0])
                  <Accordion
                    key={index}
                    filter
                    label={item}
                    items={[
                      {
                        title:
                          locale === "en"
                            ? item?.label
                            : filterByTitle(filterLabel, item?.label)
                            ? filterByTitle(filterLabel, item?.label)[0]
                            : item?.label,
                        content: item?.value?.map((item, childIndex) =>
                          // console.log('dddddd', item)
                          ({
                            text: item,
                            id: item?.id,
                          })
                        ),
                      },
                    ]}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (shopPageLevel === "childcategory") {
    return (
      <div className="filter ">
        <div className="bg-white ">
          <div className="header py-4 border-b border-border">
            <div className="px-5 flex justify-between">
              <h4 className="heading-sm uppercase text-center w-full">
                {getTranslation(
                  translation[0]?.translations,
                  "Filters",
                  locale || "en"
                )}
              </h4>
              <div
                className="size-7 flex items-center justify-center"
                onClick={closeFilter}
              >
                <i className="bi bi-x-lg cursor-pointer"></i>
              </div>
            </div>
          </div>
          <div className="max-h-screen min-h-screen overflow-auto p-5">
            <div>
              {/* FILTERED ITEMS */}
              {selectedFilters?.length > 0 && (
                <div className="pb-4 border-b border-border grid gap-3">
                  <div className="primary-font text-sm uppercase">
                    {getTranslation(
                      translation[0]?.translations,
                      "Filtered By",
                      locale || "en"
                    )}
                  </div>
                  <ul className="filtered-items">
                  {selectedFilters &&
                      selectedFilters.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-[11px] uppercase pl-1 leading-4 inline-block whitespace-break-spaces">
                           {item.split("~:")[0]} :  {locale === "en"
                              ? item.split("~:")[1].split("|")[0]
                              : item?.split("|")[1]
                              ? item?.split("|")[1]
                              : item.split("~:")[1].split("|")[0]}
                          </span>

                          <i
                            className="bi bi-x cursor-pointer text-[15px] mr-1 ml-1"
                            onClick={() => removeFilter(item)}
                          />
                        </li>
                      ))}
                  </ul>

                  <button className="btn" onClick={clearAllFilters}>
                    {getTranslation(
                      translation[0]?.translations,
                      "Clear all",
                      locale || "en"
                    )}
                  </button>
                </div>
              )}

              <div>
                {subCategories && (
                  <Accordion
                    filter
                    filterLink
                    items={[
                      {
                        title: getTranslation(
                          translation[0]?.translations,
                          "category",
                          locale || "en"
                        ),
                        content: subCategories?.map((item, childIndex) => ({
                          text:
                            locale === "en"
                              ? item?.title?.rendered
                              : item?.acf?.title_arabic
                              ? item?.acf?.title_arabic
                              : item?.title?.rendered,
                          link: item?.slug,
                          levels: "",
                        })),
                      },
                    ]}
                  />
                )}
              </div>

              {/* PRICE */}
              <div className="grid gap-4 mt-4 pb-4 border-b border-border">
                <span className="primary-font sm:text-[14px] font-semibold !text-xs uppercase">
                  {getTranslation(
                    translation[0]?.translations,
                    "Price",
                    locale || "en"
                  )}
                </span>

                <RangeSlider
                  value={value} // Value of the range slider (min and max price)
                  step={500}
                  min={0}
                  max={1000000}
                  onInput={(newValue) => setValue(newValue)} // Update state when range slider is adjusted
                />

                <div className="join w-full">
                  <input
                    type="number"
                    value={value[0]} // Min price value
                    onChange={
                      (e) => handleInputChange(0, parseInt(e.target.value)) // Pass index 0 for min price
                    }
                    min={0}
                    max={value[1]} // Max of the first input should not exceed the second input (max price)
                    className="join-item input text-center !max-h-[40px] !min-h-[40px] w-full"
                  />
                  <input
                    type="number"
                    value={value[1]} // Max price value
                    onChange={
                      (e) => handleInputChange(1, parseInt(e.target.value)) // Pass index 1 for max price
                    }
                    min={value[0]} // Min of the second input should not be less than the first input (min price)
                    max={100000} // Max is fixed at 100,000
                    className="join-item input text-center !max-h-[40px] !min-h-[40px] w-full"
                  />
                </div>
              </div>

              {/* COLOR */}
              {hasColor && (
                <Accordion
                filter
                filterGraphic
                items={[
                  {
                    title: getTranslation(
                      translation[0]?.translations,
                      "Color",
                      locale || "en"
                    ),
                    content: colorItems.map((item, childIndex) =>
                      //console.log(item?.val?.split('~:')[1].split('|')[0])

                      ({
                        text: item?.val,
                        id: item?.id,
                        item: item?.item,
                      })
                    ),
                  },
                ]}
              />
              )}

              {/* BLADE STYLE */}
              {hasBladetype && (
                <Accordion
                filter
                filterGraphic
                items={[
                  {
                    title: getTranslation(
                      translation[0]?.translations,
                      "Blade shape",
                      locale || "en"
                    ),
                    content: bladeItems.map((item, childIndex) => ({
                      text: item?.val,
                      id: item?.id,
                      item: item?.item,
                    })),
                  },
                ]}
              />
              )}

              {groupedData &&
                groupedData.map((item, index) => (
                  <Accordion
                    key={index}
                    filter
                    label={item}
                    items={[
                      {
                        title:
                          locale === "en"
                            ? item?.label
                            : filterByTitle(filterLabel, item?.label)
                            ? filterByTitle(filterLabel, item?.label)[0]
                            : item?.label,
                        content: item?.value?.map((item, childIndex) =>
                          // console.log('dddddd', item)
                          ({
                            text: item,
                            id: item?.id,
                          })
                        ),
                      },
                    ]}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
