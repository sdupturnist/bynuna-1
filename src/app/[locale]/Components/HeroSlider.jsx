"use client";

import Slider from "react-slick";
import Images from "./Images";
import Button from "./Button";
import { homeUrl } from "../Utils/variables";

export default function HeroSlider({ data, locale }) {

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Set interval to 3 seconds (3000 ms)
    fade: true, // Enable fade effect
    cssEase: "linear", // Smooth transition for fade effect
    rtl: locale, // Add the RTL setting here based on your language context
  };

  return (
    <Slider {...settings}>
      {data &&
        data.map((item, index) => (
          <div className="sm:min-h-[70vh] min-h-[50vh]" key={index}>
            <div className="container container-fixed absolute right-0 left-0 bottom-0 top-0 flex items-center z-10 [&>*]:text-white">
              <div className="grid gap-5 w-full">
                <h1 className="heading-xl">{item?.title?.rendered}</h1>
                <div>
                  <Button
                    link
                    url={`${homeUrl}${locale}/products`}
                    label={item?.acf?.hero_button}
                  />
                </div>
              </div>
            </div>
            <div className="mask-hero z-[-1]">
              <Images
                imageurl={item?.featured_image_details?.src}
                quality="100"
                width="2000"
                height="1000"
                alt="Powering Your Tactical Needs"
                title="Powering Your Tactical Needs"
                classes="block w-full sm:h-[70vh] h-[50vh] object-cover"
                placeholder={true}
              />
            </div>
          </div>
        ))}
    </Slider>
  );
}
