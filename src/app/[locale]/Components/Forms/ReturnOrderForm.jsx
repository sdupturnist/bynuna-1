"use client";


import { useState } from "react";
import {
  apiUrl,
  getTranslation,
  homeUrl,
  siteEmail,
  siteName,
} from "../../Utils/variables";
import SectionHeader from "../SectionHeader";
import { useJwt } from "../../Context/jwtContext";
import { useLanguageContext } from "../../Context/LanguageContext";
import { sendMail } from "../../Utils/Mail";
import { ReturnEmailTemplate } from "../../Utils/MailTemplates";
import Alerts from "../Alerts";
import FloatingLabelInput from "../FloatingLabelInput";
import { useParams, useRouter } from "next/navigation";


export default function ReturnOrderForm({ userInfo, data, }) {
  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [packageStatus, setPackageStatus] = useState("");
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Enhanced error state to store error messages

  const { token } = useJwt();


   const { translation } = useLanguageContext();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Check if the user is authenticated
    if (!userInfo?.id) {
      setError(
        getTranslation(
          translation[0]?.translations,
          "User not authenticated. Please login to submit the return.",
          locale
        )
       
      );
      return;
    }
  
    setLoading(true);
    setError(null); // Reset error state on form submission
  
    const requestData = {
      title: `Return - Order #${data?.id}`,
      content: `Reason: ${reason}. Faulty or other details: ${details || ""}`,
      status: "publish",
      order_id: data?.id,
      amount: data?.total || "",
      opened: packageStatus || "",
      transition_id: data?.transaction_id || "COD",
    };
  
    try {
      // Submit the return request
      const responseReturnDataCollection = await fetch(
        `${apiUrl}wp-json/custom/v1/returns/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );
  
      // Update the order status to returned
      const responseUpdateCurrentOrder = await fetch(
        `${apiUrl}wp-json/wc/v3/orders/${data?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status : "return-initiated",
          }),
        }
      );
  
      if (responseReturnDataCollection.ok && responseUpdateCurrentOrder.ok) {
        setLoading(false);
        setStatus(true);
  
        // Send Mail notification to admin
        await sendMail({
          sendTo: siteEmail,
          subject: `You have received a new return request. | ${siteName}`,
          name: "Admin",
          message: ReturnEmailTemplate(
            requestData?.title,
            requestData?.content,
            requestData?.order_id,
            requestData?.amount,
            requestData?.opened,
            requestData?.transaction_id || "COD"
          ),
        });
  
        // Send Mail notification to user
        await sendMail({
          sendTo: userInfo?.email,
          subject: `Your return request has been successfully submitted. | ${siteName}`,
          name: userInfo?.first_name || '',
          message: ReturnEmailTemplate(
            requestData?.title,
            requestData?.content,
            requestData?.order_id,
            requestData?.amount,
            requestData?.opened,
            requestData?.transaction_id || "COD"
          ),
        });
  
        setReason("");
        setDetails("");
        setPackageStatus("");
  
        setTimeout(() => {
          setStatus(false);
          router.push(`${homeUrl}${locale}/account/orders`); // Redirect to account page
        }, 3000);

        
      } else {
        const errorResponse = await responseReturnDataCollection.json();
        setError(
          errorResponse?.message ||
          getTranslation(
            translation[0]?.translations,
            "An unknown error occurred while submitting your return request.",
            locale
          )
          
        );
        setLoading(false);
        setStatus(false);
      }
    } catch (error) {
      setError(
        getTranslation(
          translation[0]?.translations,
          "An error occurred while submitting the return request. Please try again later.",
          locale
        )
       
      );
      setLoading(false);
      setStatus(false);
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
            locale
          )}
         
        />
      )}
      {/* {error && <Alerts status="red" title={error} />} */}
  <div className="mt-4">
  <SectionHeader
   title={getTranslation(
    translation[0]?.translations,
    "Return order",
    locale
  )}
      
      />
      <div className="grid gap-6">
        <select
          type="text"
          className="input"
          onChange={(e) => setReason(e.target.value)}
          required
          autoComplete="none"
        >
          <option value="" disabled selected>
            
            {getTranslation(
              translation[0]?.translations,
              "Reason for Return",
              locale
            )}
          </option>
          <option value="Dead On Arrival">
          {getTranslation(
              translation[0]?.translations,
              "Dead On Arrival",
              locale
            )}
          </option>
          <option value="Faulty, please supply details">
            
            {getTranslation(
              translation[0]?.translations,
              "Faulty, please supply details",
              locale
            )}
          </option>
          <option value="Order Error">
          {getTranslation(
              translation[0]?.translations,
              "Order Error",
              locale
            )}
          </option>
          <option value="Other, please supply details">
           
            {getTranslation(
              translation[0]?.translations,
              "Other, please supply details",
              locale
            )}
          </option>
          <option value="Received Wrong Item">
          {getTranslation(
              translation[0]?.translations,
              "Received Wrong Item",
              locale
            )}
            
            </option>
        </select>

        <div className="flex items-center gap-2">
          <input
            value="Opened"
            onChange={(e) => setPackageStatus(e.target.value)}
            type="checkbox"
            className="checkbox checkbox-sm checkbox-success"
          />
          <label className="label-text">
          {getTranslation(
              translation[0]?.translations,
              "Product is opened?",
              locale
            )}
          </label>
        </div>

        <FloatingLabelInput
          textarea
          className="input"
          label={getTranslation(
            translation[0]?.translations,
            "Faulty or other details",
            locale
          )}
        
          onChange={(e) => setDetails(e.target.value)}
        />

        <div>
          <button className="btn btn-primary btn-mobile-full" type="submit" disabled={loading}>
         {loading ?  
         getTranslation(
          translation[0]?.translations,
         "Submiting...",
          locale
        )
         : 
         getTranslation(
          translation[0]?.translations,
         "Confirm to return",
          locale
        )
       }   
          </button>
        </div>
      </div>
  </div>
    </form>
  );
}
