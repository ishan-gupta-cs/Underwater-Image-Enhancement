import React from "react";
import "./ImageDisplay.css"; // Create a CSS file for styling

const ImageDisplay = ({ imageUrl }) => {
return (
    <div className="image-display-container">
    <h2>Enhanced Image:</h2>
    <img
        src={imageUrl}
        alt="Enhanced"
        className="image-display"
    />
    </div>
);
};

export default ImageDisplay;
