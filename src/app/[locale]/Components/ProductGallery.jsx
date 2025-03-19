'use client'

// import SliderImage from "react-zoom-slider";
import ImageGallery from "react-image-gallery";

export default function ProductGallery({ data }) {

  // Mapping the dynamic data to the format expected by ImageGallery
  const images = Array.isArray(data)
    ? data.map((item) => ({
        original: item?.url || '',  // URL of the image
        thumbnail: item?.url || '', // Thumbnail URL
      }))
    : [{ original: data || '', thumbnail: data || '' }];

  console.log(images);

  return (
    // <SliderImage
    //   data={images}
    //   showDescription={true}
    //   direction="right"
    //   nav={false}
    // />

    <ImageGallery 
    items={images} 
    loading="lazy"
    showNav={true}
    showPlayButton={false}
    />
  );
}
