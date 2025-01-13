import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css"; // Import the CSS file for styling

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile)); // Generate a preview URL
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/enhance-image",
        formData
      );
      setEnhancedImage(response.data.enhanced_image_url); // Use the URL from the response
    } catch (error) {
      console.error("Error enhancing image:", error);
      alert("Failed to enhance image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="file-upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <button
          onClick={handleSubmit}
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Enhancing..." : "Enhance Image"}
        </button>
      </div>

      <div className="image-display-container">
        {previewImage && (
          <div className="image-display">
            <h3>Original Image</h3>
            <img
              src={previewImage}
              alt="Original"
              className="image-preview"
            />
          </div>
        )}
        {enhancedImage && (
          <div className="image-display">
            <h3>Enhanced Image</h3>
            <img
              src={enhancedImage}
              alt="Enhanced"
              className="image-preview"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
