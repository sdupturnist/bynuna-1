

import Login from "../../Components/Forms/Login";
import Images from "../../Components/Images";
import SectionHeader from "../../Components/SectionHeader";
import {   apiUrl,
  homeUrl,
  metaStaticData,
  siteLogo,
  siteName,  } from "../../Utils/variables";


export default function LoginPage() {
  return (
    <section className="pb-0 grid sm:gap-10 gap-6 sm:pt-20 pt-8">
      <div className="container container-fixed">
        <div className="max-w-lg mx-auto sm:border sm:border-border sm:px-[50px] px-[20px] sm:pt-[50px] sm:pb-[50px] grid gap-2">
          <SectionHeader
            title= "Login to your account"
            titleCenter
          />
          <Login />
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


export async function generateMetadata({ params, searchParams }, parent) {

  const staticData = metaStaticData;

  try {
    const page = await fetch(
      `${apiUrl}wp-json/wp/v2/pages?slug=login&lang=en`,

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
      viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
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
            staticData.ogImage,
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    // Return static data in case of an error
    return staticData;
  }
}