"use client";

import {
  apiUrl,
  getTranslation,
  homeUrl,
  siteName,
} from "../../Utils/variables";
import { useEffect, useState } from "react";
import Alerts from "../Alerts";
import { sendMail } from "../../Utils/Mail";
import Link from "next/link";
import Cookies from "js-cookie";
import ModalPopup from "../ModalPopup";
import FloatingLabelInput from "../FloatingLabelInput";
import DatePicker from "react-datepicker";
import { useLanguageContext } from "../../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";
import LoadingItem from "../LoadingItem";

export default function Signup({customers}) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;
  const currentYear = new Date().getFullYear(); // Get the current year
  const maxDate = new Date(currentYear, 11, 31);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [error, setError] = useState(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const [emailAlreadyHave, setEmailAlreadyHave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacyContent, setPrivacyContent] = useState([]);

  const { translation } = useLanguageContext();

  function isOver18(dateOfBirth) {
    const today = new Date();
    const dob = new Date(dateOfBirth);

    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age >= 18;
  }



  const privacy = () =>
    fetch(`${apiUrl}wp-json/wp/v2/pages?slug=privacy-policy&lang=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        setPrivacyContent(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });


      const isEmailExist = customers && customers?.some(user => user.email === email);


  useEffect(() => {
    setPrivacyContent(privacy);
  }, []);

  // Auto hide the error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null); // Hide the error after 5 seconds
      }, 5000);

      return () => clearTimeout(timer); // Clean up the timer on component unmount or when error changes
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOver18(dateOfBirth)) {
      setError(
        getTranslation(
          translation[0]?.translations,
          "You must be at least 18 years old.",
          locale || "en"
        )
      );
      return false;
    }

    setLoading(true);

    if (password.length < 6) {
      setPasswordTooShort(true);
      setLoading(false);
      return;
    }

    setPasswordTooShort(false);

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      setLoading(false);
      return;
    }

    setPasswordMismatch(false);



if (isEmailExist) {
  setEmailAlreadyHave(true)
  setLoading(false);
  return;
} 

setEmailAlreadyHave(false)


    try {
      const token = Math.random().toString(36).substring(2);

      // Send the verification email
      await sendMail({
        sendTo: email,
        subject: "Please verify your registration",
        name: username,
        message: `Hello ${username},\n\nPlease click the button below to confirm your registration:\n\n<a href="${homeUrl}${locale}/auth/confirm-email?token=${token}&username=${username}&email=${email}&password=${password}&subscribe=${subscribeEmail}" style="color:#fff;text-decoration:none;font-weight:600;margin:20px 0;border-radius:0px;display:block;background:#988643;text-align:center;padding: 12px 19px;width: max-content;font-size: 15px;text-transform: uppercase;">Confirm Your Email</a>\n\nThank you!`,
      });

      setLoading(false);
      Cookies.set(`${siteName}_register_verify_email`, "true", {
        expires: 5 / 1440,
      });
      router.push(`${homeUrl}${locale}/auth/check-your-email?email=${email}`);
    } catch (err) {
      setError(
        err.message ||
          getTranslation(
            translation[0]?.translations,
            "An error occurred",
            locale || "en"
          )
      );
      setLoading(false);
    }
  };

  return (
    <>
      <ModalPopup
        title={getTranslation(
          translation[0]?.translations,
          "Privacy policy",
          locale || "en"
        )}
        item={
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: (privacy && privacyContent[0]?.content?.rendered) || "",
            }}
          ></div>
        }
        noButton
      />
      <div className="grid gap-5">
        {error && <Alerts title={error} status="red" />}
        {passwordMismatch && (
          <Alerts
            title={getTranslation(
              translation[0]?.translations,
              "Passwords do not match",
              locale || "en"
            )}
            status="red"
          />
        )}
        {passwordTooShort && (
          <Alerts
            title={getTranslation(
              translation[0]?.translations,
              "Password must be at least 6 characters",
              locale || "en"
            )}
            status="red"
          />
        )}
            {emailAlreadyHave && (
          <Alerts
            title={getTranslation(
              translation[0]?.translations,
              "Email already in use. Please try another.",
              locale || "en"
            )}
            status="red"
          />
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 mt-3">
            <FloatingLabelInput
              type="text"
              label={getTranslation(
                translation[0]?.translations,
                "Full name",
                locale || "en"
              )}
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <FloatingLabelInput
              type="email"
              label={getTranslation(
                translation[0]?.translations,
                "Email",
                locale || "en"
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <DatePicker
              selected={dateOfBirth}
              onChange={(date) => setDateOfBirth(date)}
              fixedHeight
              placeholderText={getTranslation(
                translation[0]?.translations,
                "Date of birth",
                locale || "en"
              )}
              className="input w-full"
              required
              dateFormat="MM/dd/yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              maxDate={maxDate} // Set the max date to December 31 of the current year
            />

            <FloatingLabelInput
              type="password"
              label={getTranslation(
                translation[0]?.translations,
                "Password",
                locale || "en"
              )}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <FloatingLabelInput
              type="password"
              label={getTranslation(
                translation[0]?.translations,
                "Confirm password",
                locale || "en"
              )}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="grid gap-3 my-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-sm"
                  name="subscribed_newsletter"
                  value="email_subscribed"
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                />
                <label>
                  {getTranslation(
                    translation[0]?.translations,
                    "Sign up for our newsletter?",
                    locale || "en"
                  )}
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-sm"
                  required
                />
                <label>
                  {getTranslation(
                    translation[0]?.translations,
                    "I have read and agree to the",
                    locale || "en"
                  )}  <span
                    className="underline text-primary cursor-pointer hover:opacity-60 transition-all"
                    onClick={(e) =>
                      document.getElementById("modal_all").showModal()
                    }
                  >
                    {getTranslation(
                      translation[0]?.translations,
                      "Privacy Policy",
                      locale || "en"
                    )}
                  </span>
                </label>
              </div>
            </div>
            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <LoadingItem dot classes="size-4 !text-dark" />
              ) : (
                getTranslation(
                  translation[0]?.translations,
                  "Register",
                  locale || "en"
                )
              )}
            </button>
            <Link className="btn" href={`${homeUrl}${locale}/auth/login`}>
              {getTranslation(
                translation[0]?.translations,
                "Login",
                locale || "en"
              )}
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
