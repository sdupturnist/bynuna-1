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
import NextTopLoader from "nextjs-toploader";
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

// Specify the font weights here
const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["latin"] });
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"], // Define the weights
});



export default async function RootLayout({ children }) {

  const locale = await getLocale()


  // const messages = await getMessages()

  // if (!routing.includes(locale)) {
  //   notFound()
  // }



  
  return (
    <html lang={locale} dir={locale === 'en' ? 'ltr' : 'rtl'}>
       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
      <body>
        <ClientProvider>
          <NextTopLoader
            color="#fff"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            zIndex={1600}
            showAtBottom={false}
          />
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




// import { NextIntlClientProvider } from "next-intl"
// import { getMessages } from "next-intl/server"
// import { notFound } from "next/navigation"
// import { routing } from "@/i18n/routing"

// export default async function LocaleLayout({ children, params: { locale } }) {
//   // Ensure that the incoming `locale` is valid
//   if (!routing.locales.includes(locale)) {
//     notFound()
//   }

//   // Providing all messages to the client
//   // side is the easiest way to get started
//   const messages = await getMessages()

//   return (
//     <html lang={locale}>
//       <body>
//         <NextIntlClientProvider messages={messages}>
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   )
// }
