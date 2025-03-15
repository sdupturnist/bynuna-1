//https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      domains: [
        'avataaars.io', 
        'admin.wellness4u.in',
        'secure.gravatar.com',
        'ardalmarmoom.com',
        'via.placeholder.com',
        'admin.bynuna.ae',
        'admin.ardalmarmoom.com'
      ],
    },
    
   


  };
  
  export default withNextIntl(nextConfig);
  