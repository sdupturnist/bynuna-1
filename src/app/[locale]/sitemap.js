import { apiUrl, homeUrl, woocommerceKey } from "./Utils/variables";

export default async function sitemap() {
  const pagesResponse = await fetch(`${apiUrl}wp-json/wp/v2/pages?lang=en`);
  const pages = await pagesResponse.json();

  const postsResponse = await fetch(`${apiUrl}wp-json/wp/v2/posts?lang=en`);
  const posts = await postsResponse.json();

  const productsResponse = await fetch(
    `${apiUrl}wp-json/wc/v3/products${woocommerceKey}&lang=en`
  );
  const products = await productsResponse.json();

  const excludedPages = [
    "my-account",
    "category",
    "home",
    "child-category",
    "sub-category",
    "confirm-age",
  ];

  const sitemapData = [
    ...pages
      .filter((page) => !excludedPages.includes(page.slug))
      .map((page) => ({
        url: `${homeUrl}en/${removeLanguageCode(page.slug)}`,
        lastModified: new Date(page.modified),
        changeFrequency: getChangeFrequency(page),
        priority: getPriority(page),
      })),
    ...posts.map((post) => ({
      url: `${homeUrl}en/blogs/${removeLanguageCode(post.slug)}`,
      lastModified: new Date(post.modified),
      changeFrequency: getChangeFrequency(post),
      priority: getPriority(post),
    })),
    ...products.map((product) => {
      const categorySlug =
        product.categories && product.categories.length > 0
          ? product.categories[0].slug
          : "uncategorized";

      return {
        url: `${homeUrl}en/products/${removeLanguageCode(
          product?.acf?.main_categories[0]?.post_name
        )}/${removeLanguageCode(
          product?.acf?.sub_categories[0]?.post_name
        )}/${removeLanguageCode(product.slug)}`,
        lastModified: new Date(product.date_modified),
        changeFrequency: getChangeFrequency(product),
        priority: getPriority(product),
      };
    }),

    // Static URLs
    {
      url: `${homeUrl}en`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Rewrite the register URL
  sitemapData.forEach((item) => {
    if (item.url === `${homeUrl}en/register`) {
      item.url = `${homeUrl}en/auth/register`;
    }
    // Rewrite the login URL
    if (item.url === `${homeUrl}en/login`) {
      item.url = `${homeUrl}en/auth/login`;
    }
  });

  return sitemapData;
}

function removeLanguageCode(slug) {
  return slug.replace(/-en$| -ar$/, ""); // Removes "-en" and "-ar" at the end of the string
}

function getChangeFrequency(item) {
  if (item.type === "post") {
    return "weekly";
  }
  if (item.type === "product") {
    return "daily";
  }
  return "monthly";
}

function getPriority(item) {
  if (item.type === "post") {
    return 0.7;
  }
  if (item.type === "product") {
    return 0.9;
  }
  return 0.8;
}
