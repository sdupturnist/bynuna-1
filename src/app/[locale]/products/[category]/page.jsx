import Card from "../../Components/Card";
import Alerts from "../../Components/Alerts";

import {
  apiUrl,
  homeUrl,
  metaStaticData,
  siteLogo,
  siteName,
} from "../../Utils/variables";


export default async function Category({
  params,
  searchParams,
  params: { locale },
}) {
  const { category } = await params;
  const decodeUrl = decodeURIComponent(category);

  // Fetch sub-categories
  let subCategories = await fetch(
    `${apiUrl}wp-json/wp/v2/sub-categories?per_page=99&order_by=menu_order&order=asc`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  // Ensure that `category` is defined and filter `subCategories` by matching `post_name`
  const filteredItems =
    category &&
    subCategories &&
    subCategories.filter((item) =>
      item.acf.main_categories.some(
        (mainCategory) => mainCategory.post_name === category
      )
    );

  return !filteredItems?.length > 0 ? (
    <Alerts
      noLogo
      title="Sorry, no items found!"
      large
      url={homeUrl}
      //desc={`Thanks for signing up! Please check your email for a confirmation link to finish your registration.`}
    />
  ) : (
    <div className="bg-bggray">
      <section className="p-0">
        <div className="container lg:py-10 p-0">
          <ul className="border-list">
            {subCategories &&
              filteredItems?.map((item, index) => (
                <Card
                  type="subcategoryLarge"
                  key={index}
                  data={item}
                  locale={locale}
                />
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params, searchParams }, parent) {
  const staticData = metaStaticData;

  try {
    const page = await fetch(
      `${apiUrl}wp-json/wp/v2/pages?slug=products&lang=en`,

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

      author: siteName + " Admin",
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
          pageData?.yoast_head_json?.og_image?.[0]?.url || staticData.ogImage,
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    // Return static data in case of an error
    return staticData;
  }
}
