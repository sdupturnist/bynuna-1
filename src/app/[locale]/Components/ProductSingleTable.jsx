"use client";

import Cookies from "js-cookie";
import { useLanguageContext } from "../Context/LanguageContext";
import { apiUrl, getTranslation } from "../Utils/variables";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingItem from "./LoadingItem";

const parseValue = (value) => {
  const parsedArray = value.split(",").map((item) => {
    const [label, val] = item.split("~");
    if (!label || !val) return {}; // Safeguard against missing parts

    const [label_en, label_ar] = label.split(":");
    const [value_en, value_ar] = val.split("|");

    // Remove colon (:) from the values
    const value_en_no_colon = value_en?.replace(":", "").trim() || "";
    const value_ar_no_colon = value_ar?.replace(":", "").trim() || "";

    return {
      label_en: label_en?.trim() || "",
      label_ar: label_ar?.trim() || "",
      value_en: value_en_no_colon, // Store the cleaned value
      value_ar: value_ar_no_colon, // Store the cleaned value
    };
  });

  // Filter out rows where both the label and value are empty
  return parsedArray.filter((item) => item.label_en || item.label_ar);
};

export default function GenerateTable({ tableData }) {
  // console.log(tableData)

  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "en"; // Get locale from URL params or default to 'en'

  const { translation } = useLanguageContext();

  // Parse the value string from the data
  const parsedTableData = tableData.map((item) => ({
    ...item,
    parsedValue: parseValue(item.value),
  }));

  const [filterLabel, setFilterLabel] = useState([]);

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
  }, [parseValue, tableData]);

  // console.log(filterLabel)
  function filterByTitle(filters, title) {
    // Filter the filters array by the title and extract the `acf.arabic` value
    const filtered = filters?.filter(
      (filter) => filter?.title?.rendered === title
    );

    // Return the `acf.arabic` value for each filtered result
    return filtered.map((filter) => filter?.acf?.arabic);
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"}>
      {" "}
      {/* Add dir attribute for RTL support */}
      <table
        border="1"
        cellPadding="5"
        cellSpacing="0"
        className="!mt-0 capitalize"
      >
        <thead>
          <tr>
            <th>
              {getTranslation(translation[0]?.translations, "Key", locale)}
            </th>
            <th>
              {getTranslation(translation[0]?.translations, "Value", locale)}
            </th>
          </tr>
        </thead>
        <tbody>
          {parsedTableData &&
            parsedTableData[0]?.parsedValue?.map((item, index) => (
              <tr key={index}>
                <td>
                  {locale === "ar" ? (
                    filterByTitle(filterLabel, item?.label_en)[0] ? (
                      filterByTitle(filterLabel, item?.label_en)[0]
                    ) : (
                      <LoadingItem classes="size-3 mt-2" dot />
                    )
                  ) : (
                    item.label_en
                  )}
                </td>
                <td>{locale === "ar" ? item.value_ar : item.value_en}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
