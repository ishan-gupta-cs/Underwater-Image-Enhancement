import React, { useState } from "react";
import axios from "axios";
import './ImageEnhancer.css';
import ImageDisplay from './ImageDisplay'; // Import ImageDisplay component

const ImageEnhancer = () => {
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [enhancementProgress, setEnhancementProgress] = useState([]);
  const [finalImage, setFinalImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setUploadedImage(URL.createObjectURL(selectedFile));
  };

  const handleEnhance = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);
    setEnhancementProgress([]);
    setFinalImage(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/enhance-image", formData, {
        responseType: "json",
      });

      console.log("Backend Response:", response.data);  // Log the response from backend

      const { intermediateImages, finalImage } = response.data;

      if (Array.isArray(intermediateImages)) {
        setEnhancementProgress(intermediateImages);
      }
      if (finalImage) {
        setFinalImage(finalImage);
      }
    } catch (error) {
      console.error("Error enhancing image:", error);
      alert("Failed to enhance image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-enhancer-container">
      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleEnhance} disabled={loading}>
          {loading ? "Enhancing..." : "Enhance Image"}
        </button>
      </div>
      
      {/* Using ImageDisplay Component */}
      <ImageDisplay 
        uploadedImage={uploadedImage} 
        enhancementProgress={enhancementProgress} 
        finalImage={finalImage} 
      />
    </div>
  );
};

export default ImageEnhancer;
