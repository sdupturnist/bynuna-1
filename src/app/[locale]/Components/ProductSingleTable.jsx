"use client";

import Cookies from "js-cookie";
import { useLanguageContext } from "../Context/LanguageContext";
import { getTranslation } from "../Utils/variables";
import { useParams, useRouter } from "next/navigation";

// Helper function to parse the "value" string into an array of objects
const parseValue = (value) => {
  const parsedArray = value.split(',').map((item) => {
    const [label, val] = item.split('~');
    if (!label || !val) return {}; // Safeguard against missing parts

    const [label_en, label_ar] = label.split(':');
    const [value_en, value_ar] = val.split('|');
    
    console.log("Parsed Item:", { label_en, label_ar, value_en, value_ar }); // Check parsed values

    return {
      label_en: label_en?.trim() || '',
      label_ar: label_ar?.trim() || '',
      value_en: value_en?.trim() || '',
      value_ar: value_ar?.trim() || '',
    };
  });

  // Filter out rows where both the label and value are empty
  return parsedArray.filter(item => item.label_en || item.label_ar);
};

export default function GenerateTable({ tableData }) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "en"; // Get locale from URL params or default to 'en'

  const { translation } = useLanguageContext();

  // Parse the value string from the data
  const parsedTableData = tableData.map((item) => ({
    ...item,
    parsedValue: parseValue(item.value),
  }));

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}> {/* Add dir attribute for RTL support */}
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
                  {locale === "ar" ? item.label_ar : item.label_en}
                </td>
                <td>
                  {locale === "ar" ? item.value_ar : item.value_en}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
