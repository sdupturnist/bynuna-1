"use client";

import { useEffect, useState } from "react";
import { apiUrl, siteName } from "../Utils/variables";
import Button from "./Button";
import Images from "./Images";
import Cookies from "js-cookie"; // Import js-cookie
import LoadingItem from "./LoadingItem";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";  // Import useRouter

export default function ConfirmAge() {
  const router = useRouter();  // Initialize router

  const params = useParams();  
  const locale = params.locale; 

  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(true);

  const confirmAgePageData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wp/v2/pages?slug=confirm-age&lang=${locale || 'en'}`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch header menus");
      }
      const data = await response.json();
      setPageData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmAge = () => {
    // Set the cookie with 365 days expiry
    Cookies.set(`${siteName}_ageConfirmed`, "true", { expires: 365 });
    location.reload();
  };

  useEffect(() => {
    if (pageData[0]?.content?.rendered) {
      setLoading(false);
    }
    confirmAgePageData();
  }, [pageData]);

  const handleCancel = () => {
    // Redirect user to another page instead of closing the tab
    router.replace("https://www.google.com");  // Corrected the URL
  };

  return (
    <div className="confirm-age sm:p-5 w-full">
      <div className="p-0 bg-white xl:h-[80vh] xl:flex items-center justify-between xl:min-w-[80%] sm:min-w-[90%] w-full min-w-full">
        <Images
          imageurl="/images/welcome.png"
          quality="100"
          width="1000"
          height="1000"
          alt="Powering Your Tactical Needs"
          title="Powering Your Tactical Needs"
          classes="block w-full object-cover mx-auto xl:h-full sm:h-[50vh] h-[30vh]"
          placeholder={true}
        />
        <div className="w-full xl:px-16 sm-5 xl:py-20 p-7 gap-7 sm:h-auto h-[70vh] overflow-auto">
          <div className="w-full gap-3 grid">
            {loading && (
              <div className="w-full flex items-center justify-center min-h-screen">
                <LoadingItem spinner />
              </div>
            )}
            {!loading && pageData[0]?.content?.rendered && (
              <div
                className="confirm-age-content w-full"
                dangerouslySetInnerHTML={{
                  __html: pageData[0]?.content?.rendered,
                }}
              />
            )}
          </div>
          <div className="hidden sm:flex gap-3 mt-5">
            <Button
              classes="bg-primary text-white"
              action={confirmAge}
              label={pageData[0]?.acf?.confirm_age_button}
            />
            <button
              className="btn"
              onClick={handleCancel} // Trigger the redirection
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <Button
        classes="fixed bottom-0 w-full left-0 right-0 bg-primary text-white sm:hidden"
        action={confirmAge}
        label={pageData[0]?.acf?.confirm_age_button}
      />
    </div>
  );
}
