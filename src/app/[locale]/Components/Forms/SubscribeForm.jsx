"use client";

import { apiUrl, siteEmail, siteName } from "../../../../Utils/variables";
import Alerts from "../../Alerts";
import { sendMail } from "../../../../Utils/Mail";
import { useState } from "react";
import { SubscribeEmailTemplate } from "../../../../Utils/MailTemplates";
import { useJwt } from "../../Context/jwtContext";
import { useLanguageContext } from "../../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";

export default function SubscribeForm() {
  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token } = useJwt();


  const { translation } = useLanguageContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}wp-json/wp/v2/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLoading(false);
        setSuccess(
          getTranslation(
            translation[0]?.translations,
            "Thank You for Subscribing!",
            locale || 'en'
          )
        );

        //TO ADMIN
        await sendMail({
          sendTo: siteEmail,
          name: "Admin",
          subject: `Subscribe - ${siteName}`,
          message: SubscribeEmailTemplate(email),
        });

        //TO USER
        await sendMail({
          sendTo: email,
          name: "",
          subject: `Thank You for Subscribing! - ${siteName}`,
          message: `Thank you for subscribing to our newsletter! We're excited to have you on board. You'll now be the first to know about our latest products, exclusive offers, and insider news. Stay tuned for exciting updates coming your way!`,
        });
      } else {
        setError(
          data.message ||
            getTranslation(
              translation[0]?.translations,
              "An error occurred. Please try again.",
              locale || 'en'
            )
        );
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setError(error);
    }
  };

  return (
    <div className="grid gap-5 mt-4">
      {success && <Alerts title={success} status="green" />}
      {error && <Alerts title={error} status="red" />}
      <form onSubmit={handleSubmit}>
        <div className="join w-full">
          <input
            type="email"
            className="input join-item w-full"
            placeholder={getTranslation(
              translation[0]?.translations,
              "Enter email address",
              locale || 'en'
            )}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            className="btn join-item !h-[48px]"
            type="submit"
            disabled={loading && true}
          >
            {loading ? (
              <LoadingItem dot classes="!text-white opacity-[0.5] size-5" />
            ) : (
              getTranslation(
                translation[0]?.translations,
                "Subscribe",
                locale || 'en'
              )
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
