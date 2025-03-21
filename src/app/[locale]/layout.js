import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { Inter, Merriweather, Cairo } from "next/font/google";
import "../../../public/styles/theme.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ClientProvider from "./ClientProvider";
import {
  metaAuthor,
  metaDescription,
  metaKeywords,
  metaOgDescription,
  metaOgImage,
  metaOgSiteName,
  metaOgUrl,
  metaTitle,
  metaTwitterCard,
  metaTwitterCreator,
  metaTwitterImage,
  metaTwitterSite,
  metaViewport,
  siteName,
} from "./Utils/variables";
import ConfirmAge from "./Components/ConfirmAge";
import { notFound } from "next/navigation"

// Specify the font weights here
// const inter = Inter({ subsets: ["latin"] });
// const cairo = Cairo({ subsets: ["latin"] });
// const merriweather = Merriweather({
//   subsets: ["latin"],
//   weight: ["300", "400", "700", "900"], // Define the weights
// });


export const metadata = {
  title: metaTitle,
  description: metaDescription,
  author: metaAuthor,
  keywords: metaKeywords,
  viewport: metaViewport,
  robots: metaViewport,
  ogTitle: metaTitle,
  ogDescription: metaOgDescription,
  ogImage: metaOgImage,
  ogUrl: metaOgUrl,
  ogSiteName: metaOgSiteName,
  twitterCard: metaTwitterCard,
  twitterSite: metaTwitterSite,
  twitterCreator: metaTwitterCreator,
  twitterImage: metaTwitterImage,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // interactiveWidget: 'resizes-visual', // You can keep this if you plan to use it
};


// Specify the font weights here
const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["latin"] });
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"], // Define the weights
});



export default async function RootLayout({ children }) {

  const locale = await getLocale()



  return (
    <html lang={locale} dir={locale === 'en' ? 'ltr' : 'rtl'}>
      <body>
        <ClientProvider>
          <Header 
          locale={locale}
          />
          <main className="overflow-hidden">
          <NextIntlClientProvider>
            {children}
            </NextIntlClientProvider>
            </main>
          <Footer
           locale={locale}
            />
        </ClientProvider>
      </body>
    </html>
  );



  
}
