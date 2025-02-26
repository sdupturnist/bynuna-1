"use client";

import { useSiteContext } from "../Context/siteContext";
import {
  convertCurrency,
  OfferPercentage,
  currencyRate,
} from "../Utils/variables";

export default function Price({ regular, sale, isCard, small }) {
  const { activeCurrencySymbol, activeCurrency, currencies } = useSiteContext();

  const currency = currencies?.find(
    (currency) =>
      currency.slug === String(activeCurrency).toLowerCase().replace(/ /g, "-")
  );

  return (
    <div>
      {parseInt(regular) >= parseInt(sale) ? (
        <div className="gap-2 flex items-center w-full justify-center">
          <span
            className={`block text-center line-through  opacity-30 ${
              isCard
                ? "sm:text-[18px] text-[14px]"
                : ` ${small ? "text-sm" : "text-[18px]"} `
            }`}
          >
            {activeCurrencySymbol}
            {convertCurrency(regular, currency?.acf?.currency_rate)}
          </span>
          <span
            className={`block text-center font-semibold ${
              isCard
                ? "sm:text-[18px] text-[14px]"
                : ` ${small ? "text-sm" : "text-[18px]"} `
            }`}
          >
            {activeCurrencySymbol}
            {convertCurrency(sale, currency?.acf?.currency_rate)}
          </span>
        </div>
      ) : (
        <span
          className={`block text-center font-semibold ${
            isCard
              ? "sm:text-[18px] text-[14px]"
              : ` ${small ? "text-sm" : "text-[18px]"} `
          }`}
        >
          {activeCurrencySymbol}
          {convertCurrency(regular, currency?.acf?.currency_rate)}
        </span>
      )}
      {/* <span className="product-price">
        {currency[0]?.label}
        {sale}
      </span>
      {sale  && (
        <span className="product-price-regular mx-[6px]">
          {currency[0]?.label}
          {regular}
        </span>
      )} */}
      {/* <span>
     <OfferPercentage normalprice={regular} saleprice={sale} />
     </span> */}
    </div>
  );
}
