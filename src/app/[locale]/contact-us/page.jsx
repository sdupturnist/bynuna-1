import { Suspense } from "react";
import ContactInfo from "../Components/ContactInfo";
import ContactForm from "../Components/Forms/ContactForm";
import Images from "../Components/Images";
import Loading from "../Components/LoadingItem";
import SocialIcons from "../Components/SocialIcons";
import {
  apiUrl,
  homeUrl,
  metaStaticData,
  siteAuthor,
  siteLogo,
  siteName,
} from "../Utils/variables";



export default async function ContactUs({params: { locale }}) {

  let pageData = await fetch(
    `${apiUrl}wp-json/wp/v2/pages?slug=contact&lang=${locale || "en"}`,
    {
      next: { revalidate: 60 },
    }
  );

  let [page] = await pageData.json();

  return (
    <section className="spacing-normal">
      <div className="container container-fixed text-center">
        <div className="grid gap-7">
          <div className="mx-auto max-w-[767px] w-full grid sm:gap-10 gap-5 sm:mt-5">
            <div className="grid gap-5">
              {page?.content?.rendered && (
                <div
                  className="about"
                  dangerouslySetInnerHTML={{
                    __html: page?.content?.rendered,
                  }}
                />
              )}{" "}
            </div>
            <div>
              <Suspense fallback={<Loading classes="text-primary" dot />}>
                <ContactInfo />
              </Suspense>
            </div>
            <div className="border-t border-black sm:pb-[70px] sm:pt-[50px] py-[30px] mt-5">
              <div className="px-5 sm:px-0">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



export async function generateMetadata({ params, searchParams }, parent) {

  const staticData = metaStaticData;

  try {
    const page = await fetch(
      `${apiUrl}wp-json/wp/v2/pages?slug=contact-us&lang=en`,

      {
        next: { revalidate: 60 },
      }
    );

    const [pageData] = await page.json();



    // Return metadata object with dynamic values, or fall back to static values
    return {
      title:
        pageData?.yoast_head_json?.title ||
        pageData?.yoast_head_json?.og_title ||
        staticData.title,
      description:
        pageData?.yoast_head_json?.og_description || staticData.og_description,

      author: siteName+' Admin',
      viewport: "width=device-width, initial-scale=1",
      robots: pageData?.yoast_head_json?.robots || staticData.robots,
      alternates: {
        canonical: homeUrl,
      },
      og_locale: pageData?.yoast_head_json?.og_locale || staticData.og_locale,
      og_type: pageData?.yoast_head_json?.og_type || staticData.og_type,
      og_title: pageData?.yoast_head_json?.og_title || staticData.og_title,
      og_description:
        pageData?.yoast_head_json?.og_description || staticData.og_description,
      og_url: pageData?.yoast_head_json?.og_url
        ?.replace("/admin", "")
        .replace("/home", ""),
      article_modified_time:
        pageData?.yoast_head_json?.article_modified_time ||
        staticData.article_modified_time,
      twitter_card: staticData.twitter_card,
      twitter_misc:
        pageData?.yoast_head_json?.twitter_misc || staticData.twitter_misc,
      twitter_site: staticData.twitter_site,
      twitter_creator: staticData.twitter_creator,
      twitter_image:
        pageData?.yoast_head_json?.og_image?.[0]?.url ||
        siteLogo ||
        staticData.twitter_image,
      openGraph: {
        images: [
          pageData?.yoast_head_json?.og_image?.[0]?.url ||
            staticData.openGraph?.images,
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    // Return static data in case of an error
    return staticData;
  }
}