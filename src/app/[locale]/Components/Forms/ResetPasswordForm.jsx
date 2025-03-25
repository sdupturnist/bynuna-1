"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { apiUrl, getTranslation, homeUrl, siteName } from "../../Utils/variables";
import Alerts from "../Alerts";
import FloatingLabelInput from "../FloatingLabelInput";
import { useLanguageContext } from "../../Context/LanguageContext";
import { sendMail } from "../../Utils/Mail";


export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 
  const searchParams = useSearchParams(); // Get the query parameters

  const token = searchParams.get("token");
  const email = searchParams.get("email");


    const { translation } = useLanguageContext();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!token || !email) {
      setMessage(
        getTranslation(
          translation[0]?.translations,
          "Invalid or expired link.",
          locale || 'en'
        )
     
      );
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true)

    // Validation checks
    if (newPassword.length < 6) {
      setLoading(false)
      setError(
        getTranslation(
          translation[0]?.translations,
          "Password must be at least 6 characters.",
          locale || 'en'
        )
       
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setLoading(false)
      setError(
        getTranslation(
          translation[0]?.translations,
          "Passwords do not match.",
          locale || 'en'
        )
     
      );
      return;
    }

    // Reset the error message if validation passes
    setError("");
    setLoading(false)

    const res = await fetch(`${apiUrl}wp-json/password-reset/v1/reset`, {
      method: "POST",
      body: JSON.stringify({ token, email, newPassword }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message);

      await sendMail({
        sendTo: email,
        subject:   "Your password has been successfully changed",
        message: `We wanted to let you know that your account password has been successfully updated. If you made this change, no further action is required. If you did not request this change, please reset your password immediately to secure your account. For any concerns or assistance, feel free to contact our support team.`,
      });

      setTimeout(() => {
        setLoading(false)
        router.push(`${homeUrl}${locale}/auth/login?confirmEmailLogin=true`);
      }, 1000);


    } else {
      setLoading(false)
      setError(
        data.message === 'Token expired.' ? getTranslation(
          translation[0]?.translations,
          "Token expired.",
          locale || 'en'
        ) : data.message 
         ||
        getTranslation(
          translation[0]?.translations,
          "An error occurred. Please try again.",
          locale || 'en'
        )
        
      );
    }
  };

  return (
    <div className="grid gap-5">
      {message && <Alerts title={message} status="green" />}
      {error && <Alerts title={error} status="red" />}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 mt-3">
          <FloatingLabelInput
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            label={getTranslation(
              translation[0]?.translations,
              "Enter new password",
              locale || 'en'
            )}
          
            className="input"
            required
            password
          />
          <FloatingLabelInput
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label={getTranslation(
              translation[0]?.translations,
              "Confirm new password",
              locale || 'en'
            )}
           
            className="input"
            required
            password
          />

          <button
          disabled={loading}
          className="btn btn-large" type="submit">
             {loading ?
              getTranslation(
                translation[0]?.translations,
                "Submiting...",
                locale || 'en'
              )
              : 
             
             getTranslation(
              translation[0]?.translations,
              "Reset password",
              locale || 'en'
            )
          }
          </button>
        </div>
      </form>
    </div>
  );
}
