'use client'
import ImageGallery from "react-image-gallery";
import SliderImage from "react-zoom-slider";

export default function ProductGallery({data}){

     const images =
    data.map((item) => ({
      image: item?.url,
       text: item?.alt
    })) || [];




    return(

      <SliderImage
        data={images}
        showDescription={true}
        direction="right"
        nav={false}
      />

      //   <ImageGallery
      //   items={images}
      //   showNav={false}
      //   lazyLoad={true}
      //   showThumbnails={true}
      //   autoPlay={false}
      //   showFullscreenButton={true}
      //   showPlayButton={false}
      //   thumbnailWidth={10} // Adjust this value to your desired thumbnail width
      //   thumbnailHeight={75} // Adjust this value to your desired thumbnail height
      // />
    )
}