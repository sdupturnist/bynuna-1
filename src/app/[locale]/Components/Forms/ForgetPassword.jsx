"use client";

import { useState } from "react";

import {
  apiUrl,
  getTranslation,
  homeUrl,
} from "../../Utils/variables";
import Alerts from "../Alerts";
import { useRouter } from "nextjs-toploader/app";
import FloatingLabelInput from "../FloatingLabelInput";
import { useJwt } from "../../Context/jwtContext";
import { useLanguageContext } from "../../Context/LanguageContext";
import { useParams } from "next/navigation";
import { sendMail } from "../../Utils/Mail";

export default function PasswordResetRequest() {
  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 

  const { token } = useJwt();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const { translation } = useLanguageContext();

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const res = await fetch(`${apiUrl}wp-json/password-reset/v1/request`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      const { token, email } = data;

      try {
        await sendMail({
          sendTo: email,
          subject: "Password Reset Request",
          message: `Hello,\n\nPlease click the following link to confirm your password reset:\n\n<a href="${homeUrl}${locale}/auth/reset-password?token=${token}&email=${email}&confirmEmailLogin=true" style="color:#fff;text-decoration:none;font-weight:600;margin:20px 0;border-radius:4px;display:block;background:#988643;text-align:center;border-radius:0px;padding: 12px 19px;width: max-content;font-size: 15px;text-transform: uppercase;">Confirm Your Email</a>\n\nThank you!`,
        });

        setMessage(
          getTranslation(
            translation[0]?.translations,
            "Your password reset request has been successfully submitted! Please note that the reset link will remain valid for only 30 minutes.",
            locale || 'en'
          )
        );

        setTimeout(() => {
          setLoading(false);
          router.push(`${homeUrl}${locale}/auth/login?confirmEmailLogin=true`);
        }, 3000);
      } catch (error) {
        console.error("Error sending email:", error);
        setError(error);
      }
    } else {
      setError(
        (data.message === "No user found with this email address." &&
          getTranslation(
            translation[0]?.translations,
            "No user found with this email address",
            locale || 'en'
          )) ||
          getTranslation(
            translation[0]?.translations,
            "An error occurred. Please try again.",
            locale || 'en'
          )
      );

      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5">
      {message && <Alerts title={message} status="green" />}
      {error && <Alerts title={error} status="red" />}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5">
          <FloatingLabelInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            label={getTranslation(
              translation[0]?.translations,
              "Enter your email",
              locale || 'en'
            )}
            required
          />

          <button
            disabled={loading}
            className="btn btn-primary w-full"
            type="submit"
          >
            {loading
              ? getTranslation(
                  translation[0]?.translations,
                  "Submiting",
                  locale || 'en'
                )
              : getTranslation(
                  translation[0]?.translations,
                  "Reset password",
                  locale || 'en'
                )}
          </button>
        </div>
      </form>
    </div>
  );
}
