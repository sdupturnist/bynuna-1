"use client";

import { getTranslation, siteEmail, siteName } from "../../Utils/variables";
import { useState } from "react";
import FloatingLabelInput from "../FloatingLabelInput";
import { useLanguageContext } from "../../Context/LanguageContext";
import { sendMail } from "../../Utils/Mail";
import { ContactEmailTemplate } from "../../Utils/MailTemplates";
import Alerts from "../Alerts";
import { useParams, useRouter } from "next/navigation";
import LoadingItem from "../LoadingItem";

export default function ContactForm() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { translation } = useLanguageContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendMail({
        sendTo: siteEmail,
        name: "Admin",
        subject: `Contact - ${siteName}`,
        message: ContactEmailTemplate(name, email, subject, message),
      });
      setLoading(false);
      setSuccess(
        getTranslation(
          translation[0]?.translations,
          "Thanks for contacting us! Our team is reviewing your submission and will get back to you soon.",
          locale || "en"
        )
      );

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");

      router.refresh();
    } catch (error) {
      console.error("Error sending email:", error);
      setError(error);
    }
  };

  return (
    <>
      <h3 className="text-center heading-lg sm:mb-10 mb-5">
        {getTranslation(
          translation[0]?.translations,
          "Get In Touch",
          locale || "en"
        )}
      </h3>
      <div className="grid gap-5">
        {success && <Alerts title={success} status="green" />}
        {error && <Alerts title={error} status="red" />}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <FloatingLabelInput
              type="text"
              className="input"
              label={getTranslation(
                translation[0]?.translations,
                "Name",
                locale || "en"
              )}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <FloatingLabelInput
              type="email"
              className="input"
              label={getTranslation(
                translation[0]?.translations,
                "Email",
                locale || "en"
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FloatingLabelInput
              type="text"
              className="input"
              label={getTranslation(
                translation[0]?.translations,
                "Subject",
                locale || "en"
              )}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <FloatingLabelInput
              textarea
              className="input"
              label={getTranslation(
                translation[0]?.translations,
                "Message",
                locale || "en"
              )}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div>
              <button
                className="btn btn-primary btn-mobile-full w-full"
                type="submit"
                disabled={loading && true}
              >
                {/* {loading && (
                
                  <LoadingItem dot classes="!text-dark opacity-[0.5] size-5" /> 
                    ) } */}
                {getTranslation(
                  translation[0]?.translations,
                  "Submit",
                  locale || "en"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
