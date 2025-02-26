"use client";
import { getTranslation } from "../Utils/variables";
import Link from "next/link";
import Images from "./Images";
import {useParams, useRouter } from "next/navigation";
import LoadingItem from "./LoadingItem";
import { useLanguageContext } from "../Context/LanguageContext";

export default function Alerts({
  cartEmpty,
  status,
  title,
  titleSmall,
  large,
  noIcon,
  icon,
  noPageUrl,
  center,
  nobg,
  url,
  desc,
  loading,
  
}) {
  
    const router = useRouter();
     const params = useParams();  
     const locale = params.locale; 
 
  const { translation } = useLanguageContext();

  let alertClass = "";
  // let icon = null;

  switch (status) {
    case "red":
      alertClass = "bg-red-200 border-red-600 text-red-600";
      break;
    case "green":
      alertClass = "bg-green-100 border-green-600 text-green-600";
      break;
    case "yellow":
      alertClass = "bg-yellow-100 border-yellow-600 text-yellow-600";
      break;
    default:
      alertClass = "bg-light border-light text-primary";
      break;
  }

  return (
    <>
      {cartEmpty && !large && (
        <div className="grid items-center justify-center">
          <div className="empty-cart"></div>
          <h1 className="text-center sm:text-xl text-base sm:mb-10 mb-7 mt-3">
            {getTranslation(translation[0]?.translations, title, locale || 'en')}
          </h1>
          <div className="text-center mb-5">
            <Link href={url} className="btn btn-primary">
              {getTranslation(
                translation[0]?.translations,
                "Back to shop",
                locale || 'en'
              )}
            </Link>
          </div>
        </div>
      )}
      {!large && !cartEmpty && (
        <div
          role="alert"
          className={`alert rounded-none ${
            nobg ? "bg-transparent  opacity-40 [&>*]:text-base" : alertClass
          } rounded-md p-3 sm:text-base flex ${
            center ? "text-center justify-center" : "text-start"
          } `}
        >
          {!noIcon && icon}
          <span
            className={`${center && "text-center"} ${
              titleSmall ? "text-sm" : "text-base"
            }`}
          >
            {getTranslation(translation[0]?.translations, title, locale || 'en')}
          </span>
        </div>
      )}
      {large && !cartEmpty && (
        <section className="pb-0 grid sm:gap-10 gap-6 sm:pt-20 pt-8 text-center">
          <div className="container container-fixed grid gap-3">
            {loading && (
              <LoadingItem spinner classes="text-center mx-auto mb-5" />
            )}
            <h1 className="heading-xl text-center text-primary">
              {getTranslation(translation[0]?.translations, title, locale || 'en')}
            </h1>
            {desc && (
              <p>
                {getTranslation(translation[0]?.translations, desc, locale || 'en')}
              </p>
            )}
            {!noPageUrl && (
              <div className="text-center mt-3">
                <Link href={url} className="btn btn-primary">
                  {getTranslation(
                    translation[0]?.translations,
                    "Back to home",
                    locale || 'en'
                  )}
                </Link>
              </div>
            )}
          </div>
          <Images
            imageurl="/images/brand-bg.webp"
            quality="100"
            width="1500"
            height="300"
            alt="Bynuna"
            title="Bynuna"
            classes="block w-full mx-auto"
            placeholder={true}
          />
        </section>
      )}
    </>
  );
}
