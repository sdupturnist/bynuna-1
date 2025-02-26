"use client";
import Slider from "react-slick";
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
import ProductCard from "./ProductCard";

export default function ProductSlider({ data, count }) {
  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: count || 5,
    slidesToScroll: count || 5,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,  // Enable centering of the active slide
    centerPadding: '0', // Adjust padding if necessary
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          centerPadding: '15px', // Space for smaller screens
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '10px', // Adjust for mobile
        },
      },
    ],
  };
  

  const items = data.map((item, index) => (
    <ProductCard key={index} data={item}/>
  ));

  return <Slider {...settings}>{items}</Slider>;
}
