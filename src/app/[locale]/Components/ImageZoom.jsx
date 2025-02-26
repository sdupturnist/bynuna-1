'use client'

import React, { useState, useRef } from "react";

export default function ImageWithZoom({
  imageurl,
  quality = "100",
  width = "800",
  height = "800",
  title = "Image",
  alt = "Image",
  classes = "",
  placeholder = false
}) {
  const [isZoomVisible, setZoomVisible] = useState(false); // Zoom visibility state
  const [lensPosition, setLensPosition] = useState({ left: 0, top: 0 }); // Position of the zoom lens
  const [zoomedImage, setZoomedImage] = useState(null); // Image source for zoomed version
  const lensRef = useRef(null); // Reference for the zoom lens

  const handleMouseMove = (e) => {
    const lens = lensRef.current;
    const image = e.target;

    // Show zoom lens when hovering over the image
    setZoomVisible(true);
    setZoomedImage(image.src); // Set the source for the zoomed image

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
    setZoomVisible(false); // Hide the zoom lens when mouse leaves
  };

  return (
    <div className={classes} style={{ position: "relative" }}>
      {/* Image */}
      <img
        src={imageurl}
        alt={alt}
        title={title}
        width={width}
        height={height}
        style={{ width: "100%", cursor: "zoom-in" }} // Image styles
        loading={placeholder ? "lazy" : "eager"} // Lazy loading for placeholder
        onMouseMove={handleMouseMove} // Trigger zoom effect on mouse move
        onMouseLeave={handleMouseLeave} // Hide zoom on mouse leave
      />

      {/* Zoom lens that follows mouse */}
      {isZoomVisible && (
        <div
          ref={lensRef}
          style={{
            position: "absolute",
            width: "100px", // Adjust lens size
            height: "100px", // Adjust lens size
            borderRadius: "50%", // Circular lens, change to 0 for square
            border: "2px solid #fff",
            backgroundColor: "rgba(255, 255, 255, 0.4)", // Semi-transparent lens background
            pointerEvents: "none", // Prevent lens from blocking mouse events
            top: lensPosition.top,
            left: lensPosition.left
          }}
        ></div>
      )}

      {/* External container for the zoomed image */}
      {isZoomVisible && zoomedImage && (
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
