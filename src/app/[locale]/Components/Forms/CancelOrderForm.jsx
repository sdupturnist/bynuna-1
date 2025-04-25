"use client";

import { useState } from "react";
import {
  apiUrl,
  getTranslation,
  homeUrl,
  siteEmail,
  siteName,
  woocommerceKey,
} from "../../Utils/variables";

import SectionHeader from "../SectionHeader";
import { useLanguageContext } from "../../Context/LanguageContext";
import FloatingLabelInput from "../FloatingLabelInput";
import { sendMail } from "../../Utils/Mail";
import { CancelEmailTemplate } from "../../Utils/MailTemplates";
import Alerts from "../Alerts";
import { useJwt } from "../../Context/jwtContext";
import { useParams, useRouter } from "next/navigation";


export default function CancelOrderForm({ userInfo, data }) {
  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 

  const { token } = useJwt();

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Enhanced error state to store error messages


  const { translation } = useLanguageContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userInfo?.id) {
      setError(
        getTranslation(
          translation[0]?.translations,
          "User not authenticated. Please login to submit the return.",
          locale || 'en'
        )
      );
      return;
    }

    setLoading(true);
    setError(null); // Reset error state on form submission

    const requestData = {
      title: `Cancellation - Order #", "ar") ${data?.id}`,
      content: `Reason: ${reason}. Faulty or other details: ${details || ""}`,
      status: "publish",
      order_id: data?.id,
      amount: data?.total || "",
      transition_id: data?.transaction_id || "COD",
    };

    try {
      const responseCancelDataCollection = await fetch(
        `${apiUrl}wp-json/wc/v3/orders/${data?.id}${woocommerceKey}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "cancelled",
          }),
        }
      );

      setLoading(false);
      setStatus(true);

      if (responseCancelDataCollection.ok) {
        // Mail notification to admin
        await sendMail({
          sendTo: siteEmail,
          subject: `You have received a new cancellation request. | ${siteName}`,
          name: "Admin",
          message: CancelEmailTemplate(
            requestData?.title,
            requestData?.content,
            requestData?.order_id,
            requestData?.amount,
            requestData?.transaction_id || "COD"
          ),
        });

        // Mail notification to user
        await sendMail({
          sendTo: userInfo?.email,
          subject: `Your order cancellation request has been successfully submitted. | ${siteName}`,
          name: userInfo?.name,
          message: CancelEmailTemplate(
            requestData?.title,
            requestData?.content,
            requestData?.order_id,
            requestData?.amount,
            requestData?.transaction_id || "COD"
          ),
        });

        setReason("");
        setDetails("");

        setTimeout(() => {
          setStatus(false);

          router.push(`${homeUrl}${locale}/account/orders`); // Redirect to account page
        }, 1000);
      }

      setLoading(false);
      setStatus(
        getTranslation(
          translation[0]?.translations,
          "Thanks for contacting us! Our team is reviewing your submission and will get back to you soon.",
          locale || 'en'
        )
      );
      setReason("");
      setDetails("");
    } catch (error) {
      console.error("Error Sending Cancellation Request:", error);
      setError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="none">
      {status && (
        <Alerts
          status="green"
          title={getTranslation(
            translation[0]?.translations,
            "Your order return request has been successfully submitted. We will review the details and get back to you shortly.",
            locale || 'en'
          )}
        />
      )}
      {error && <Alerts status="red" title={error} />}

      <div className="grid gap-6 mt-4">
        <SectionHeader
          title={getTranslation(
            translation[0]?.translations,
            "Cancel order",
            locale || 'en'
          )}
          noSpacing
        />
        <select
          type="text"
          className="input"
          onChange={(e) => setReason(e.target.value)}
          required
          autoComplete="none"
        >
          <option value="" disabled defaultValue={getTranslation(
              translation[0]?.translations,
              "Reason for cancel",
              locale || 'en'
            )}>
            {getTranslation(
              translation[0]?.translations,
              "Reason for cancel",
              locale || 'en'
            )}
          </option>

          <option value="Order Error">
            {getTranslation(
              translation[0]?.translations,
              "Order Error",
              locale || 'en'
            )}
          </option>

          <option value="Customer Changed Mind">
            {getTranslation(
              translation[0]?.translations,
              "Changed Mind",
              locale || 'en'
            )}
          </option>
          <option value="Shipping Delay">
            {getTranslation(
              translation[0]?.translations,
              "Shipping Delay",
              locale || 'en'
            )}
          </option>
          <option value="Incorrect Order Details">
            {getTranslation(
              translation[0]?.translations,
              "Incorrect Order Details",
              locale || 'en'
            )}
          </option>
          <option value="Payment Issues">
            {getTranslation(
              translation[0]?.translations,
              "Payment Issues",
              locale || 'en'
            )}
          </option>
          <option value="Order Not Needed Anymore">
            {getTranslation(
              translation[0]?.translations,
              "Order Not Needed Anymore",
              locale || 'en'
            )}
          </option>
          <option value="Price Error">
            {getTranslation(
              translation[0]?.translations,
              "Price Error",
              locale || 'en'
            )}
          </option>
        </select>

        <FloatingLabelInput
  textarea
  className="input"
  label={getTranslation(
    translation[0]?.translations,
    "Any other reasons?",
    locale || 'en'
  )}
  name="details"
  value={details} 
  onChange={(name, value) => setDetails(value)} 
/>

        <div>
          <button
            className="btn btn-primary btn-mobile-full"
            type="submit"
            disabled={loading}
          >
            {loading
              ? getTranslation(
                  translation[0]?.translations,
                  "Cancelling",
                  locale || 'en'
                )
              : getTranslation(
                  translation[0]?.translations,
                  "Confirm to cancel",
                  locale || 'en'
                )}
          </button>
        </div>
      </div>
    </form>
  );
}
