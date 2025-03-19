'use client';
import { useEffect, useState } from "react";
import { useAuthContext } from "../Context/authContext";
import { homeUrl, siteName } from "./variables";
import { useCartContext } from "../Context/cartContext";
import Cookies from "js-cookie"; 
import LoadingItem from '../Components/LoadingItem';
import { useParams, useRouter } from 'next/navigation';



const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
   
    const { guestUser } = useCartContext();
  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 
    const [loading, setLoading] = useState(false);

   const token =  typeof window !== "undefined" && Cookies.get(`${siteName}_token`);
   


   useEffect(() => {
     if (!guestUser && !token) {
       setLoading(true); // Start loading if no token
       setTimeout(() => {
         router.push(`${homeUrl}${locale}/auth/login?mainLogin=true`);
       }, 1000); // Redirect after 1 second
     }
   }, [token, homeUrl, router]);
 
   if (loading) {
     return (
       <div className="flex items-center justify-center min-h-[80vh]">
         <LoadingItem spinner /> {/* Show loading spinner */}
       </div>
     );
   }

   
    
   

    // Render the wrapped component if authenticated or a guest
    return <WrappedComponent {...props} />;
  };

  // Set the displayName for the HOC
  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
};

export default withAuth;




