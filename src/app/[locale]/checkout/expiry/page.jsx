'use client'

import Alerts from "../../Components/Alerts";
import { homeUrl } from "../../Utils/variables";


export default function FailedPage() {
  return (


    <Alerts
    noLogo
    title="Payment Expired"
    large
    url={homeUrl}
    desc={`We're sorry, but your payment session has expired. Please try placing your order again. If any amount has been debited from your account, it will be credited back to your account within 7 business days.`}
  />
   
  );
}
