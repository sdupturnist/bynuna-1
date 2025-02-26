"use client";

import { useEffect, useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid"; // Import icons from Heroicons
import {
  apiUrl,
  getTranslation,
  homeUrl,
  linkSlug,
  siteName,
} from "../Utils/variables";
import ViewMoreLess from "./ViewMoreLess";
import { useSiteContext } from "../Context/siteContext";
import { useRouter } from "next/navigation";
import { useLanguageContext } from "../Context/LanguageContext";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";

const Accordion = ({
  items,
  navigation,
  filter,
  filterGraphic,
  filterLink,
  filterComponent,
  general,
  noHtml,
  haveUrl,
}) => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { translation } = useLanguageContext();

  const [openIndex, setOpenIndex] = useState(null);
  const {
    showMegaMenu,
    queryUpdated,
    setQueryUpdated,
    setShowMegaMenu,
    selectedFilters,
    setSelectedFilters,
  } = useSiteContext();

  //CHECK EXTENCTIONS
  function hasExtension(str) {
    const regex = /\.[a-zA-Z0-9]+$/;
    return regex.test(str);
  }

  //==========SELETED FILTERS=============





  useEffect(() => {


    if (!queryUpdated) return;

    const currentQuery = new URLSearchParams(window.location.search);

if(Array.isArray(selectedFilters)){

    currentQuery.delete("meta_key");
    currentQuery.delete("meta_value");

    selectedFilters &&
      selectedFilters?.forEach((filter) => {
        currentQuery.append("meta_key", "_filter_items");
        currentQuery.append("meta_value", filter);
      });
    }

    setQueryUpdated(false);
  }, [queryUpdated, selectedFilters, router]);

  const activeFilters = (item) => {
    setQueryUpdated(true);

    setSelectedFilters((prevFilters) => {
      // Update selected filters and localStorage outside of the setter to avoid triggering re-renders during render phase
      const updatedFilters = setSelectedFilters && prevFilters.includes(item)
        ? prevFilters.filter((filter) => filter !== item)
        : [...prevFilters, item];

      return updatedFilters;
    });
  };

  useEffect(() => {
    if (selectedFilters.length === 0) return;
    setQueryUpdated(true);
  }, [selectedFilters]);

  //FILTER END

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);

    // Scroll to the element with class 'more-info' when an accordion item is clicked
    const moreInfoElement = document.querySelector(".more-info");
    if (moreInfoElement) {
      moreInfoElement.scrollIntoView({
        behavior: "smooth",
        block: "start", // Scrolls to the top of the element
      });
    }
  };

  const AccordionItem = ({
    title,
    mainCat,
    children,
    isOpen,
    onClick,
    haveUrl,
  }) => (
    <div className={`${!navigation ? `border-b rounded-none` : ""}`}>
      {navigation ? (
        <div className="flex items-center justify-between">
          {!haveUrl ? (
            <Link
              onClick={(e) => setShowMegaMenu(!showMegaMenu)}
              href={`${homeUrl}${locale}/products/${
                mainCat && mainCat?.toLowerCase()?.replace(/ /g, "-")
              }/${title && title?.toLowerCase()?.replace(/ /g, "-")}/`}
              className="w-full uppercase primary-font text-primary  text-left font-medium transition-all rounded-t-lg flex items-center justify-between"
            >
              {getTranslation(
                translation[0]?.translations,
                title,
                locale || "en"
              )}
            </Link>
          ) : (
            <h4 className="w-full uppercase primary-font text-primary  text-left font-medium transition-all rounded-t-lg flex items-center justify-between">
              {getTranslation(
                translation[0]?.translations,
                title,
                locale || "en"
              )}
            </h4>
          )}
          <div onClick={onClick} className={`${navigation && "lg:hidden"}`}>
            {isOpen ? (
              <PlusIcon className="h-5 w-5 text-primary" />
            ) : (
              <MinusIcon className="h-5 w-5 text-primary" />
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={onClick}
          className={`w-full text-left ${
            general ? "px-0 py-5" : "px-0 p-4"
          }  font-semibold transition-all rounded-t-lg flex items-center justify-between`}
        >
          <span
            className={`${
              general || filter
                ? `primary-font sm:text-[14px] text-sm ${
                    filter && "uppercase !text-xs"
                  }`
                : ""
            }`}
          >
            {getTranslation(
              translation[0]?.translations,
              title,
              locale || "en"
            )}
          </span>

          <div className={`${navigation && "sm:hidden"}`}>
            {isOpen ? (
              <MinusIcon className="h-5 w-5 text-primary" />
            ) : (
              <PlusIcon className="h-5 w-5 text-primary" />
            )}
          </div>
        </button>
      )}

      {/* NORMAL */}
      {!navigation && !filter && isOpen && (
        <div className="pb-7 bg-white rounded-b-lg general-content">
          {getTranslation(
            translation[0]?.translations,
            children,
            locale || "en"
          )}
        </div>
      )}

      {/* NAVIGATION */}
      {navigation && !isOpen && (
        <div className="bg-white grid gap-4 mt-3 rounded-none">
          {children.map((item, index) => (
            <ViewMoreLess
              footerNavigation
              key={index}
              items={[item]}
              maxLength={10}
            />
          ))}
        </div>
      )}

      {/* FILTER */}
      {filter &&
        !filterGraphic &&
        !filterLink &&
        !filterComponent &&
        isOpen && (
          <div className="bg-white rounded-b-lg grid sm:gap-2 gap-3 pb-5 max-h-[200px] overflow-auto">
            {children &&
              Array.from(new Set(children.map((item) => item?.text)))
                .map((text) => children.find((item) => item?.text === text))
                ?.map((item, index) => (
                  <div
                    key={item?.id || `${item?.text}-${index}`}
                    className="flex gap-3 items-center"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-success checkbox-xs rounded-none"
                      name="selected_address"
                      onChange={() =>
                        activeFilters(item?.text || `${item?.text}-${index}`)
                      }
                      checked={Array.isArray(selectedFilters) && selectedFilters.includes(item?.text)}
                    />
                    <label className="text-sm">
                      {getTranslation(
                        translation[0]?.translations,
                        item?.text,
                        locale || "en"
                      )}
                    </label>
                  </div>
                ))}
          </div>
        )}

      {/* FILTER GRAPHIC */}
      {filter && filterGraphic && !filterLink && !filterComponent && isOpen && (
        <div className="bg-white rounded-b-lg grid grid-cols-8 items-center gap-3 pb-5">
          {children?.map((item, index) => {
            const itemKey = item?.item?.item || `${index}`;
            const isSelected = selectedFilters.includes(item?.item?.item);

            const backgroundStyle = hasExtension(item?.item?.item)
              ? {
                  background: `url(${apiUrl}wp-content/uploads/${item?.item?.item}) no-repeat center`,
                }
              : { background: item?.item?.item };

            return (
              <div key={itemKey}>
                <div
                  className={`select-graphic rounded-full tooltip tooltip-primary tooltip-xs !bg-contain `}
                  data-tip={item?.item?.item}
                  style={{
                    ...backgroundStyle,
                  }}
                >
                  <input
                    type="checkbox"
                    className="absolute z-10 top-[5px] right-[5px] size-4 rounded-full opacity-0"
                    name="selected_address"
                    onChange={() => activeFilters(item?.item?.item)}
                    checked={isSelected}
                  />
                  {isSelected ? (
                    <div className="bg-primary text-white rounded-full absolute inset-[4px] flex items-center justify-center">
                      <i className="bi bi-check text-xs"></i>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FILTER LINK */}

      {filter && filterLink && !filterComponent && isOpen && (
        <div className="bg-white rounded-b-lg grid  gap-3 pb-5 max-h-[200px] overflow-auto">
          {children.map((item, index) => (
            <Link
              key={index}
              href={`${homeUrl}${locale}/products/${linkSlug(item?.text)}`}
              className="text-sm block transition-all hover:text-primary"
            >
              {getTranslation(
                translation[0]?.translations,
                item?.text,
                locale || "en"
              )}
            </Link>
          ))}
        </div>
      )}

      {/* FILTER COMPONENT */}
      {filter && filterComponent && isOpen && (
        <div className="bg-white rounded-b-lg grid  gap-3 pb-5">
          {getTranslation(
            translation[0]?.translations,
            children,
            locale || "en"
          )}
          {children}
        </div>
      )}
    </div>
  );

  if (general) {
    return (
      <div className="w-full mx-auto">
        {items &&
          items
            ?.filter((item) => item !== null)
            .map((item, index) => (
              <AccordionItem
                key={index}
                title={item?.title?.rendered || item?.title}
                isOpen={openIndex === index}
                onClick={(event) => {
                  toggleAccordion(index);
                }}
              >
                {noHtml ? (
                  item?.content
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item?.content?.rendered || item?.content,
                    }}
                  />
                )}
              </AccordionItem>
            ))}
      </div>
    );
  } else {
    return (
      <div className="w-full mx-auto">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            mainCat={item.mainCat}
            isOpen={openIndex === index}
            onClick={() => toggleAccordion(index)}
            haveUrl={item?.haveUrl}
          >
            {item.content}
          </AccordionItem>
        ))}
      </div>
    );
  }
};

export default Accordion;
