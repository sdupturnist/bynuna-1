
import PageHeader from "../Components/PageHeader";
import { apiUrl, homeUrl, metaStaticData, siteLogo, siteName } from "../Utils/variables";

export default async function Terms({params: { locale }}) {

  let pageData = await fetch(
    `${apiUrl}wp-json/wp/v2/pages?slug=terms-and-conditions&lang=${locale || 'en'}`,
    {
      next: { revalidate: 60 },
    }
  );

  let [page] = await pageData.json();

  return (
    <section className="p-0">
      <PageHeader title={page?.title?.rendered} />
      <div className="container lg:max-w-[60%] py-10">
        {page?.content?.rendered && (
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{
              __html: page && page?.content?.rendered,
            }}
          />
        )}
      </div>
    </section>
  );
}



export async function generateMetadata({ params, searchParams }, parent) {

  const staticData = metaStaticData;

  try {
    const page = await fetch(
      `${apiUrl}wp-json/wp/v2/pages?slug=terms-and-conditions&lang=en`,

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