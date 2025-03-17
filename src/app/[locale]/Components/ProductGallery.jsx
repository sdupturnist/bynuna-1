'use client'

import SliderImage from "react-zoom-slider";

export default function ProductGallery({ data }) {
  // Ensure data is properly formatted
  const images = Array.isArray(data) 
    ? data.map((item) => ({
        image: item?.url || '',  // Default to an empty string if url is undefined
        text: item?.alt || ''    // Default to an empty string if alt is undefined
      }))
    : [{ image: data || '', text: '' }]; // If data is a string, ensure it's wrapped in an object with image and text

 
  return (
    <SliderImage
      data={images}
      showDescription={true}
      direction="right"
      nav={false}
    />
   
  );
}
