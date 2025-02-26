export default function robots() {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',  // Disallow all pages
      },
      sitemap: 'https://wellness-for-you-ecommerce.vercel.app/sitemap.xml', // Update sitemap URL
    }
  }
  