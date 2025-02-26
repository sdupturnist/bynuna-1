'use client';

import Slider from "react-slick";
import { useState, useRef, useEffect } from "react";

export default function ImageSlider({ data }) {
  const [isZoomVisible, setZoomVisible] = useState(false); // State to control visibility of zoomed lens
  const [lensPosition, setLensPosition] = useState({ left: 0, top: 0 }); // Lens position
  const [zoomedImage, setZoomedImage] = useState(null); // Source of the zoomed-in image
  const [isLargeDevice, setIsLargeDevice] = useState(false); // State to control whether the device is large enough for zoom
  const lensRef = useRef(null); // Ref for the lens

  // Detect large device screen sizes (e.g., desktops or tablets)
  useEffect(() => {
    const checkDeviceSize = () => {
      // Assuming large devices have a screen width of 1024px or more
      setIsLargeDevice(window.innerWidth >= 1024);
    };

    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);

    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  };

  const handleMouseMove = (e, imageSrc) => {
    const lens = lensRef.current;
    const image = e.target;

    // Show lens on hover
    setZoomVisible(true);
    setZoomedImage(imageSrc);

    // Get the position of the image relative to the viewport
    const rect = image.getBoundingClientRect();
    const lensSize = 100; // Size of the zoom lens (adjust as needed)

    // Calculate lens position based on mouse position
    let x = e.clientX - rect.left - lensSize / 2;
    let y = e.clientY - rect.top - lensSize / 2;

    // Ensure the lens stays within the image boundaries
    x = Math.max(0, Math.min(x, rect.width - lensSize));
    y = Math.max(0, Math.min(y, rect.height - lensSize));

    // Set the position of the lens
    setLensPosition({ left: x, top: y });

    // Set the position of the zoomed image outside the image
    const zoomedContainer = document.querySelector('.zoomed-image');
    if (zoomedContainer) {
      zoomedContainer.style.backgroundPosition = `-${x * 2}px -${y * 2}px`;
    }
  };

  const handleMouseLeave = () => {
    setZoomVisible(false); // Hide the zoomed lens when mouse leaves
  };

  const items = data.map((item, index) => (
    <div key={index}>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          cursor: isLargeDevice ? 'zoom-in' : 'default' // Only allow zoom on large devices
        }}
        onMouseMove={(e) => isLargeDevice && handleMouseMove(e, item?.src)}
        onMouseLeave={isLargeDevice ? handleMouseLeave : null}
      >
        <img
          src={item?.src}
          alt={item?.alt || 'Product Image'}
          style={{ width: '100%' }}
        />

        {/* Lens that will follow the mouse */}
        {isZoomVisible && isLargeDevice && (
          <div
            ref={lensRef}
            style={{
              position: 'absolute',
              width: '100px', // Adjust lens size
              height: '100px', // Adjust lens size
              borderRadius: '50%', // Circular lens, change to 0 for square
              border: '2px solid #fff',
              backgroundColor: 'rgba(255, 255, 255, 0.4)', // Semi-transparent lens background
              pointerEvents: 'none', // Prevent lens from blocking mouse events
              top: lensPosition.top,
              left: lensPosition.left
            }}
          ></div>
        )}
      </div>
    </div>
  ));

  return (
    <div>
      <Slider {...settings}>{items}</Slider>

      {/* External container for zoomed image */}
      {isZoomVisible && zoomedImage && isLargeDevice && (
        <div
          className="zoomed-image"
          style={{
            position: 'fixed',
            top: '10%',
            left: '45%',
            zIndex: 1000,
            borderRadius: '12px',
            border: '1px solid #ddd',
            padding: '10px',
            backgroundColor: 'white',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            width: '500px',
            height: '450px',
            backgroundImage: `url(${zoomedImage})`,
            backgroundSize: '250%', // Zoom level (2x)
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
        ></div>
      )}
    </div>
  );
}
