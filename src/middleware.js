








// import { NextResponse } from 'next/server';
// import { siteName } from './app/[locale]/Utils/variables';
// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// // Combine both middlewares
// export function middleware(req) {
//   // Apply the Next-Intl middleware routing logic
//   const nextIntlMiddleware = createMiddleware(routing);

//   // Check if the request matches your custom config
//   if (['/check-your-email', '/confirm-email'].includes(req.nextUrl.pathname)) {
//     // Your custom logic here
//     console.log(`Request for ${siteName} at ${req.nextUrl.pathname}`);
//     return NextResponse.next();
//   }

//   // Use the next-intl middleware for i18n path matching
//   return nextIntlMiddleware(req);
// }

// export const config = {
//   // Match both internationalized pathnames and custom paths
//   matcher: ['/', '/(ar|en)/:path*', '/check-your-email', '/confirm-email'],
// };


import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|en)/:path*"]
}
