//https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      domains: [
        'localhost',
        'avataaars.io', 
        'admin.testwithupturnist.com',
        'secure.gravatar.com',
        'via.placeholder.com',
        'admin.bynuna.ae',
      ],
    },
    
   


  };
  
  export default withNextIntl(nextConfig);
  