'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';
import { apiUrl, homeUrl, siteName, woocommerceKey } from "../Utils/variables";
import Cookies from "js-cookie";  // Import js-cookie

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {




  const [auth, setAuth] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [userData, setUserData] = useState([]);
  const [user, setUser] = useState(null);
  const [validUserTocken, setValidUserTocken] = useState(null);

  const [loadingAuth, setLoadingAuth] = useState(false);


  const [error, setError] = useState("");
  const router = useRouter();





  useEffect(() => {
    // Get token and user ID from cookies
    const token =  typeof window !== "undefined" && Cookies.get(`${siteName}_token`);
    const user_email =  typeof window !== "undefined" && Cookies.get(`${siteName}_user_email`);


    setValidUserTocken(token)

    // Check if user is authenticated, if not, redirect to home
    // if (!validUserTocken) {
    //   if (!token) {
    //     router.push(homeUrl);
    //     return;
    //   }
    // }



  

    // Validate the token with the backend API
    const validateToken = async () => {
      try {
        const response = await fetch(
          `${apiUrl}wp-json/custom/v1/validate-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser({
            email: user_email,
            role: typeof window !== "undefined" && Cookies.get(`${siteName}_role`),  // Assuming 'role' is also stored in a cookie
          });
          setAuth(true);
        } else {
          setAuth(false);
       //   Cookies.remove(`${siteName}_token`);
         // Cookies.remove(`${siteName}_user_email`);
        //  Cookies.remove(`${siteName}_role`);
        }
      } catch (err) {
        setAuth(false);
        console.error("Token validation failed:", err);
        setError("Session expired or invalid token");
       // Cookies.remove(`${siteName}_token`);
      //  Cookies.remove(`${siteName}_user_email`);
      //  Cookies.remove(`${siteName}_role`);
      } finally {
        setLoadingAuth(false);
      }
    };

    auth && validateToken();
  }, [router, auth]);


  const user_email =  typeof window !== "undefined" && Cookies.get(`${siteName}_user_email`);


  useEffect(() => {
 if (validUserTocken && user_email) {
      fetch(
        `${apiUrl}wp-json/wc/v3/customers${woocommerceKey}&email=${user_email}`
      )
        .then((res) => res.json())
        .then((data) => {
          setUserData(data[0]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [validUserTocken, user_email, router]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        userToken,
        setUserToken,
        userData,
        setUserData,
        user,
        setUser,
        loadingAuth,
        setLoadingAuth,
        validUserTocken, 
        setValidUserTocken
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
