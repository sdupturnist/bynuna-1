"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";


import Link from "next/link";
import Alerts from "../Alerts";
import { useAuthContext } from "../../Context/authContext";
import Cookies from "js-cookie"; // Import js-cookie for cookies handling
import { useCartContext } from "../../Context/cartContext";
import FloatingLabelInput from "../FloatingLabelInput";
import { useLanguageContext } from "../../Context/LanguageContext";
import {   apiUrl,
  getTranslation,
  homeUrl,
  siteName, } from "../../Utils/variables";
import LoadingItem from "../LoadingItem";


function LoginForm() {
  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 
  const searchParams = useSearchParams();
  const confirmEmailLogin = searchParams.get("confirmEmailLogin");
  const mainLogin = searchParams.get("mainLogin");
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthContext();
  const { setGuestUser } = useCartContext();


  const { translation } = useLanguageContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      // Sending login request to API
      const response = await fetch(`${apiUrl}wp-json/custom/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache", // Prevent caching
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            getTranslation(
              translation[0]?.translations,
              "Invalid email or password.",
              locale || 'en'
            )
        );
      }

      // Destructuring the data from the response
      const { token, user_id, user_email, role } = data;

      // Storing token and user data in cookies
      Cookies.set(`${siteName}_token`, token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set(`${siteName}_user_email`, user_email, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set(`${siteName}_u_id`, user_id, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      // Updating auth context
      setAuth(true);
      setGuestUser(false);
      setLoading(false);

      // if (confirmEmailLogin === "true") {
      //   router.push(`${homeUrl}account`);
      // } else {
      //   router.back();
      // }


      if (confirmEmailLogin === "true" ) {
        router.push(`${homeUrl}${locale}/account`);
      } else {
        if(mainLogin === "true"){
          router.push(homeUrl);
        }
        else{
          router.back();
        }
        
      }

      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alerts title={error} status="red" />}{" "}
      {/* Display error if any */}
      <form onSubmit={handleLogin} >
        <div className="grid gap-4 mt-4">
          <FloatingLabelInput
            type="email"
            className="input"
            label={getTranslation(
              translation[0]?.translations,
              "Email",
              locale || 'en'
            )}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FloatingLabelInput
            type="password"
            className="input"
            label={getTranslation(
              translation[0]?.translations,
              "Password",
              locale || 'en'
            )}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            password
          />

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? getTranslation(
                  translation[0]?.translations,
                  "Login...",
                  locale || 'en'
                )
              : getTranslation(translation[0]?.translations, "Login", locale || 'en')}
          </button>
          <Link
            className="hover:text-primary transition-all"
            href={`${homeUrl}${locale}/auth/password-forget`}
          >
            {getTranslation(
              translation[0]?.translations,
              "Forgotten Password?",
              locale || 'en'
            )}
          </Link>
          <Link className="btn" href={`${homeUrl}${locale}/auth/register`}>
            {getTranslation(
              translation[0]?.translations,
              "Create a account",
              locale || 'en'
            )}
          </Link>
        </div>
      </form>
    </>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<LoadingItem  fullscreen />}>
      <LoginForm />
    </Suspense>
  );
}
