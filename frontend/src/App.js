import React from "react";
import FileUpload from "./components/FileUpload"; 
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <div className="background-video-container">
        <video className="background-video" autoPlay loop muted>
          <source src="/ocean.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="upload-container">
        <h1>Underwater Image Enhancement</h1>
        <FileUpload />
      </div>
    </div>
  );
};

export default App;
