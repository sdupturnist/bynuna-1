import Pagination from "../Components/Pagination";
import Card from "../Components/Card";
import {
  apiUrl,
  homeUrl,
  metaStaticData,
  siteLogo, 
  siteName
} from "../Utils/variables";
import PageHeader from "../Components/PageHeader";



export default async function Blogs({ searchParams, params: { locale } }) {
  const currentPage = searchParams.per_page || 8;



  //PAGE
  let pageData = await fetch(
    `${apiUrl}wp-json/wp/v2/pages?slug=blogs&lang=${locale || "en"}`,
    {
      next: { revalidate: 60 },
    }
  );

  let [page] = await pageData.json();

  let blogsData = await fetch(
    `${apiUrl}wp-json/wp/v2/posts?per_page=${currentPage}&orderby=date&order=desc&lang=${locale || "en"}`,
    {
      next: { revalidate: 60 },
    }
  );

  let allblogsDataCount = await fetch(
    `${apiUrl}wp-json/wp/v2/posts?per_page=100&lang=${locale || "en"}`,
    {
      next: { revalidate: 60 },
    }
  );

  let blogs = await blogsData.json();
  let allBlogsData = await allblogsDataCount.json();

  const totalBlogs = allBlogsData?.length ?? [];

  return (
    <section className="pt-0">
      <PageHeader title={page?.title?.rendered} />
      <div className="container">
        <div className="sm:pt-8 py-5 pb-5 max-w-[999px] mx-auto grid sm:gap-12 gap-5">
          <div>
            <div className="grid sm:grid-cols-2 sm:gap-8 gap-5">
              {blogs &&
                blogs.map((item, index) => (
                  <Card locale={locale} large type="blog" key={index} data={item} />
                ))}
            </div>
            <Pagination
              currentPage={parseInt(currentPage, 10)}
              totalPages={totalBlogs}
              baseUrl={`${homeUrl}${locale}/blogs`}
              itemsShowPerPage={currentPage}
              maxPerClick={1}
            />
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
      `${apiUrl}wp-json/wp/v2/pages?slug=blogs&lang=en`,

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