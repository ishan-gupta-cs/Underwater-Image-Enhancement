import React, { useEffect, useState } from "react";

const ImageAnimation = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000); // Change image every second
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="image-animation-container">
      <h3>Enhancement Progress</h3>
      <img
        src={images[currentIndex]}
        alt={`Checkpoint ${currentIndex + 1}`}
        className="image-animation"
      />
    </div>
  );
};

export default ImageAnimation;
