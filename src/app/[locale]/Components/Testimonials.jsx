"use client";
import Slider from "react-slick";
import { StarIcon } from "@heroicons/react/24/solid";
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";

export default function Testimonials({ data }) {
  const settings = {
    dots: false, // Show navigation dots
    infinite: false, // Infinite looping
    speed: 500, // Slide transition speed in ms
    slidesToShow: 1, // Display one testimonial at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Time between slides in ms
  };

 

  const items = data.map((testimonial, index) => (
    <div key={index} className="p-4">
      <div className="flex items-center justify-center mb-4">
        {/* Display stars for rating */}
        {[...Array(5)].map((_, starIndex) => (
          <StarIcon key={starIndex} className="w-7 h-7 text-yellow" />
        ))}
      </div>
      <div className="grid sm:gap-6 gap-4 text-center">
      <p className="text-dark"
            dangerouslySetInnerHTML={{ __html: testimonial?.content?.rendered }}></p>
        <span className="opacity-50">{testimonial?.title?.rendered}</span>
      </div>
    </div>
  ));

  return <Slider {...settings}>{items}</Slider>;
}
