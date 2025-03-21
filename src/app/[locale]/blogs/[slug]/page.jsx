import Card from "../../Components/Card";
import Images from "../../Components/Images";
import SectionHeader from "../../Components/SectionHeader";
import {
  apiUrl,
  metaStaticData,
  siteAuthor,
  homeUrl,
} from "../../Utils/variables";
import BlogInfo from "../../Components/BlogInfo";

export default async function BlogSingle({ params, params: { locale } }) {
  const { slug } = params;

  let blogData = await fetch(
    `${apiUrl}wp-json/wp/v2/posts?slug=${slug}&lang=${locale || "en"}`,
    {
      next: { revalidate: 60 },
    }
  );

  let blog_ = await blogData.json();

  const blog = blog_[0];

  let blogsData = await fetch(
    `${apiUrl}wp-json/wp/v2/posts?per_page=4&exclude=${blog?.id}&lang=${
      locale || "en"
    }`,
    {
      next: { revalidate: 60 },
    }
  );

  let blogs = await blogsData.json();

  return (
    <div>
      <section className="pt-0">
        <div className="container !px-0 sm:px-5 w-full min-w-full">
          <div className="container">
            <div className="sm:pt-8 py-5 pb-5 xxl:max-w-[1199px] max-w-[767px] mx-auto grid sm:gap-5 gap-5">
              <Images
                imageurl={blog?.featured_image_details?.src}
                quality="100"
                width="600"
                height="400"
                title={blog?.featured_image_details?.src?.alt}
                alt={blog?.featured_image_details?.src?.alt}
                classes="block w-full object-cover sm:mb-3"
                placeholder={true}
              />
              <h1 className="md:text-2xl sm:text-xl text-lg">
                {blog?.title?.rendered}
              </h1>
              <BlogInfo postDate={blog?.date} />
              {blog?.content?.rendered && (
                <div
                  className={`blog-content border-black ${
                    blogs && blogs.length >= 1 && "border-b pb-8"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: blog && blog?.content?.rendered,
                  }}
                />
              )}
              {blogs && blogs.length >= 1 && (
                <>
                  <SectionHeader title="More blogs" titleCenter />
                  <div className="grid sm:grid-cols-2 sm:gap-8 gap-5">
                    {blogs &&
                      blogs.map((item, index) => (
                        <Card
                          key={index}
                          data={item}
                          type="blog"
                          locale={locale}
                        />
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params, searchParams }, parent) {
  const staticData = metaStaticData;

  const slug = params.slug;
  const locale = params.locale;

  try {
    const page = await fetch(
      `${apiUrl}wp-json/wp/v2/posts?slug=${slug}&lang=${locale}`,

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

      author: siteAuthor || staticData.author, // Dynamic author or static fallback
      robots: pageData?.yoast_head_json?.robots || staticData.robots,
      alternates: {
        canonical: `${homeUrl}${locale}/blogs/${pageData?.slug}`,
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
