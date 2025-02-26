"use client";

import Slider from "react-slick";
import Images from "./Images";
import { useSiteContext } from "../Context/siteContext";
import { homeUrl } from "../Utils/variables";
import Link from "next/link";

export default function BrandSlider({ data, locale }) {
  const { brands } = useSiteContext();

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 8,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: false,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
    ],
  };


  return (
    <Slider {...settings}>
      {brands &&
        brands.map((item, index) => (
          <div key={index} className="brand-card">
           {item?.featured_image_details?.src &&  
           <Link href={`${homeUrl}${locale}/products/brands/${item?.slug}`} className="block">
            <Images
              imageurl={item?.featured_image_details?.src}
              quality="100"
              width="150"
              height="90"
              alt={item?.title?.rendered}
              title={item?.title?.rendered}
              classes="block w-full object-contain mx-auto grayscale transition-all hover:grayscale-0"
              placeholder={true}
            />
          
            </Link>
           }
          </div>
        ))}
    </Slider>
  );
}
