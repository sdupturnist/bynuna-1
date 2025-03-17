import { apiUrl, homeUrl, woocommerceKey } from "./Utils/variables";

export default async function sitemap() {
  const pagesResponse = await fetch(
    `${apiUrl}wp-json/wp/v2/pages?lang=en&per_page=99`
  );
  const pages = await pagesResponse.json();

  const postsResponse = await fetch(
    `${apiUrl}wp-json/wp/v2/posts?lang=en&per_page=99`
  );
  const posts = await postsResponse.json();

  const productsResponse = await fetch(
    `${apiUrl}wp-json/custom/v1/products?per_page=500`
  );
  const products = await productsResponse.json();

  const excludedPages = [
    "my-account",
    "category",
    "home",
    "child-category",
    "sub-category",
    "confirm-age-ar",
    "confirm-age",
  ];

  let mainCategoriesData = await fetch(
    `${apiUrl}/wp-json/custom/v1/main-categories-data/?per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  let subCategoriesData = await fetch(
    `${apiUrl}/wp-json/custom/v1/sub-categories-data/?per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  let childCategoriesData = await fetch(
    `${apiUrl}wp-json/custom/v1/child-categories-data/?per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  const mainCatById = (id) => {
    return mainCategoriesData.filter((item) => item.id === parseInt(id));
  };

  const subCatById = (id) => {
    return subCategoriesData.filter((item) => item.id === parseInt(id));
  };

  const childCatById = (id) => {
    return childCategoriesData.filter((item) => item.id === parseInt(id));
  };

  const sitemapData = [
    ...pages
      .filter((page) => !excludedPages.includes(removeLanguageCode(page.slug)))
      .map((page) => ({
        url: `${homeUrl}en/${decodeURIComponent(
          removeLanguageCode(page.slug)
        )}`,
        lastModified: new Date(page.modified),
        changeFrequency: getChangeFrequency(page),
        priority: getPriority(page),
      })),
    ...posts.map((post) => ({
      url: `${homeUrl}en/blogs/${decodeURIComponent(
        removeLanguageCode(post.slug)
      )}`,
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
        url: `${homeUrl}en/products/${
          mainCatById(
            product?.meta_data.filter(
              (item) => item.key === "main_categories_new"
            )[0]?.value
          )[0]?.slug
        }/${
          subCatById(
            product?.meta_data.filter(
              (item) => item.key === "sub_categories_new"
            )[0]?.value
          )[0]?.slug
        }/${
          childCatById(
            product?.meta_data.filter(
              (item) => item.key === "child_categories_new"
            )[0]?.value
          )[0]?.slug
        }/${decodeURIComponent(removeLanguageCode(product.slug))}`,
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
