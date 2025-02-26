"use client";

import { useSiteContext } from "../Context/siteContext";


import { useLanguageContext } from "../Context/LanguageContext";
import { convertCurrency, getTranslation, siteName } from "../Utils/variables";
import { useParams, useRouter } from "next/navigation";

export default function OfferTag({ normalprice, saleprice, currency,  }) {

    const router = useRouter();
    const params = useParams();  
    const locale = params.locale; 

  const { translation } = useLanguageContext();

  const { activeCurrencySymbol, currencies, activeCurrency } = useSiteContext();

  const currencyRate = currencies?.find(
    (currency_rate) =>
      currency_rate.slug === String(activeCurrency).toLowerCase().replace(/ /g, "-")
  );


  let normalPrice = normalprice;
  let salePrice = saleprice;

  // Check if the prices are the same
  if (normalPrice === salePrice) {
    return null; // Return null to hide when there's no discount
  }

  // Calculate the discount percentage
  let discountPercentage = Math.round(
    ((normalPrice - salePrice) / normalPrice) * 100
  );

  // Calculate the amount saved
  let amountSaved = normalPrice - salePrice;

  return (
    <span className="product-offer font-semibold inline-block">
      {getTranslation(translation[0]?.translations, "Save", locale || 'en')}
      <br /> {activeCurrencySymbol}
      {convertCurrency(parseInt(amountSaved), currencyRate?.acf?.currency_rate)}
      <br /> ({discountPercentage}%{" "}
      {getTranslation(translation[0]?.translations, "OFF", locale || 'en')})
    </span>
  );
}
