"use client";

import Link from "next/link";
import { getTranslation, homeUrl, siteName } from "../Utils/variables";
import Images from "./Images";
import { useParams, useRouter } from "next/navigation";
import { useLanguageContext } from "../Context/LanguageContext";


export default function PageNotFound({}) {

    const router = useRouter();
    const params = useParams();  
    const locale = params.locale; 

  const { translation } = useLanguageContext();

  return (
    <section className="pb-0 grid sm:gap-10 gap-6 sm:pt-20 pt-8 text-center">
      <div className="container container-fixed grid gap-3">
        <h1 className="heading-xl text-center text-primary">
          {getTranslation(
            translation[0]?.translations,
            "Oops! we can't find that page.",
            locale || 'en'
          )}
        </h1>
        <p>
          {getTranslation(
            translation[0]?.translations,
            "The page you’re looking for is no longer available. Try the homepage, search, or contact support for help.",
            locale || 'en'
          )}
        </p>
        <div className="text-center mt-3">
          <Link href={homeUrl} className="btn btn-primary">
            {getTranslation(
              translation[0]?.translations,
              "Back to home",
              locale || 'en'
            )}
          </Link>
        </div>
      </div>
      <Images
        imageurl="/images/brand-bg.webp"
        quality="100"
        width="1500"
        height="300"
        alt="Login to bynuna"
        title="Login to bynuna"
        classes="block w-full mx-auto"
        placeholder={true}
      />
    </section>
  );
}
