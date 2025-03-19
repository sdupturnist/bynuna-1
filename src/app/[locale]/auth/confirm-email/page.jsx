"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { WelcomeEmailTemplate } from "../../Utils/MailTemplates";
import LoadingItem from "../../Components/LoadingItem";
import { sendMail } from "../../Utils/Mail";
import Alerts from "../../Components/Alerts";
import { useLanguageContext } from "../../Context/LanguageContext";
import {
  apiUrl,
  getTranslation,
  homeUrl,
  siteName,
  woocommerceKey,
} from "../../Utils/variables";

// Component to handle email confirmation
const ConfirmEmailContent = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  const subscribe = searchParams.get("subscribe");
  const token = searchParams.get("token");

  const { translation } = useLanguageContext();

  useEffect(() => {
    const confirmUser = async () => {
      if (!token) {
        setError("Invalid or missing token.");
        return;
      }

      try {
        const data = {
          username: username,
          password: password,
          email: email,
          first_name: username,
          last_name: username,
          meta_data: [
            {
              key: "newsletter_subscribed",
              value: subscribe || "",
            },
          ],
        };

        const response = await fetch(
          `${apiUrl}wp-json/wc/v3/customers${woocommerceKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create customer");
        }


        if (response.ok) {


          setIsConfirmed(true);


          await sendMail({
            sendTo: email,
            subject: `Welcome to ${siteName}`,
            name: username,
            message: WelcomeEmailTemplate(
              "BYNUNA Military & Hunting Equipment Trading LLC formerly named as Bynuna Hunting & Shooting Equipment was formed in 2012 as an esteemed specialized Emirati Company in the field of Hunting, Shooting and Law Enforcement customers, which plays an eminent role to satisfy all the requirements of customers in the UAE. BYNUNA has a strong foothold on Military, Hunting, Outdoor Sports and Governmental Users. The Company has committed to ensuring that their customers have access to the highest level of quality products of the best brands of the globe by regularly measuring customer satisfactionand feedback.",
              username
            ),
          });

          setIsConfirmed(true);
         // router.push(`${homeUrl}${locale}/auth/login?confirmEmailLogin=true`);
        }
      } catch (err) {
        // console.log(err);
        // setError(
        //   "If this email address is already associated with an existing account, or if there was an error confirming your email, please try again."
        // );
      }
    };

    confirmUser();
  }, [token]);

  return (
    <>
      {error && (
        <Alerts
          large
          titleSmall
          title={error}
          status="red"
          buttonLabel="Try again"
          url={`${homeUrl}${locale}/auth/register`}
          noPageUrl
        />
      )}

      {console.log(isConfirmed)}
      {isConfirmed ? (
        <Alerts
          confirmEmail
          noLogo
          title="Email Confirmed Successfully!"
          large
          buttonLabel={getTranslation(
            translation[0]?.translations,
            "Go to login",
            locale || "en"
          )}
          url={`${homeUrl}${locale}/auth/login?confirmEmailLogin=true`}
          desc={`Your email has been successfully confirmed. You can now access your account `}
        />
      ) : (
         (
          <section>
            <div className="grid gap-5 items-center justify-center text-center">
              <LoadingItem classes="mx-auto" spinner />
              <h2>
                {getTranslation(
                  translation[0]?.translations,
                  "Confirming your email...",
                  locale || "en"
                )}
              </h2>
            </div>
          </section>
        )
      )}
    </>
  );
};

export default function ConfirmEmail() {
  return <ConfirmEmailContent />;
}
