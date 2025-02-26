"use client";

import Cookies from "js-cookie";
import { useLanguageContext } from "../Context/LanguageContext";
import { getTranslation } from "../Utils/variables";
import { useParams, useRouter } from "next/navigation";

export default function GenerateTable({ tableData,  }) {

    const router = useRouter();
       const params = useParams();  
       const locale = params.locale; 

  const { translation } = useLanguageContext();

  // Function to convert the value string into an array of key-value objects
  const transformValue = (value) => {
    return value.split(",").map((pair) => {
      const [key, val] = pair.split(":");
      return { key: key.trim(), value: val && val.trim() };
    });
  };

  return (
    tableData &&
    tableData.map((item) => (
      <div key={item.id}>
        <table
          border="1"
          cellPadding="5"
          cellSpacing="0"
          className="!mt-0 capitalize"
        >
          {/* <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead> */}
          <tbody>
            {transformValue(item.value).map((pair, index) => (
              <tr key={index}>
                <td>
                  {getTranslation(
                    translation[0]?.translations,
                    pair.key,
                    locale || 'en'
                  )}
                </td>
                <td>
                  {getTranslation(
                    translation[0]?.translations,
                    pair.value,
                    locale || 'en'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))
  );
}
