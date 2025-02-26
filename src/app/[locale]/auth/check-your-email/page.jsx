import Alerts from "../../Components/Alerts";




export default function CheckYourEmail() {
  //const searchParams = useSearchParams();
  //const email = searchParams.get("email");

  return (
    
    <Alerts
    noLogo
      title="You're Almost Done!"
      large
      noPageUrl
      desc="Thanks for signing up! Please check your email for a confirmation link to finish your registration."
    />
  );
}
