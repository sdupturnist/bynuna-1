"use client";

import Images from "./Images";
import { useEffect } from "react";

export default function PageError({ error, reset }) {
  useEffect(() => {
    // You can log the error to an error tracking service here
    console.error("Error caught in Error Boundary:", error);
  }, [error]);

  // Function to reload the page
  const handleHomeClick = () => {
    location.reload(); // This will reload the entire page
  };

  return (
    <section className="pb-0 grid sm:gap-10 gap-6 sm:pt-20 pt-8 text-center">
      <div className="container container-fixed grid gap-3 sm:gap-5">
        <h1 className="heading-xl text-center text-primary">
          Something went wrong!
        </h1>
        <p>
          Sorry, there was an issue with the application. Please try again
          later.
        </p>
        <div className="text-center mt-3">
          <button onClick={handleHomeClick} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
      <Images
        imageurl="/images/brand-bg.webp"
        quality="100"
        width="1500"
        height="300"
        alt="Internal Server Error"
        title="Internal Server Error"
        classes="block w-full mx-auto"
        placeholder={true}
      />
    </section>
  );
}
