"use client";


import Images from "./Images";
import { useParams, useRouter } from "next/navigation";

export default function Page500() {
  const router = useRouter();
  const params = useParams();



  const handleRetry = () => {
    location.reload(); // This will reload the entire page
  };


  return (
    <section className="pb-0 grid sm:gap-10 gap-6 sm:pt-20 pt-8 text-center">
      <div className="container container-fixed grid gap-3 sm:gap-5">
        <h1 className="heading-xl text-center text-primary">
        500 - Internal Server Error
        </h1>
        <p>
        Oops! Something went wrong on our end. We are working to fix it.
        </p>
        <div className="text-center mt-3">
          <button onClick={handleRetry} className="btn btn-primary">
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
