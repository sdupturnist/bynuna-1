"use client";

import Cookies from "js-cookie";
import { useLanguageContext } from "../Context/LanguageContext";
import { getTranslation } from "../Utils/variables";
import { useParams, useRouter } from "next/navigation";

export default function GenerateTable({ tableData }) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "en"; // Get locale from URL params or default to 'en'

  const { translation } = useLanguageContext();

  return (
    <div>
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
          {tableData &&
            tableData[0]?.value?.map((item, index) => (
              <tr key={index}>
                <td>
                  {locale === "ar" ? item.label_ar : item.label_en}{" "}
                  {/* Render label based on locale */}
                </td>
                <td>
                  {locale === "ar" ? item.value_ar : item.value_en}{" "}
                  {/* Render value based on locale */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
