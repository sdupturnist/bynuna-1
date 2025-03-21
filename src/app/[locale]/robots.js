export default function robots() {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',  // Disallow all pages
      },
      sitemap: 'https://testwithupturnist.com/en/sitemap.xml',
    }
  }
  