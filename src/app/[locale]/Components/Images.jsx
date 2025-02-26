import Image from "next/image";
import { siteName } from "../Utils/variables";

export default function Images({
  imageurl,
  styles,
  quality,
  width,
  height,
  alt,
  classes,
  placeholder
}) {
  const blurUrl_ = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQMAAABDsxw2AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRF//fczXrgsgAAADxJREFUeJztyjEBAAAMAqDZv/Qq6A83uUo0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdM0TdO0vT0NmwEtZkyx0wAAAABJRU5ErkJggg==';

  // // Check if the image URL is valid
  // const isValidUrl = (url) => {
  //   try {
  //     return Boolean(new URL(url));
  //   } catch (e) {
  //     return false;
  //   }
  // };

  // const validImageUrl = imageurl && isValidUrl(imageurl) ? imageurl : '/images/image-placeholder.webp';

  return (
    <>
 
      {
       
        <Image
        width={width}
    height={height}
    quality={quality}
    placeholder={placeholder == true ? 'blur' : 'empty'}
    blurDataURL={blurUrl_}
    src={imageurl === 'undefined' || imageurl === '' || imageurl === "" || imageurl === null || !imageurl ?   '/images/placeholder_brand.jpg': imageurl }
    className={classes}
    alt={alt || siteName}
    title={alt || siteName}
        />
      }
    </>
  );
}
