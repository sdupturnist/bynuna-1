import Alerts from "../../Components/Alerts";
import { homeUrl } from "../../Utils/variables";

export default function FailedPage() {
  return (
    <Alerts
    noLogo
    title="Payment Cancelled"
    large
    url={homeUrl}
    desc={`We're sorry, but your payment has been cancelled. Please check your information and try again. If any amount has been debited from your account, please be assured that it will be credited back to your account within 7 business days.`}
  />
  
  );
}
