// /src/components/UploadAssignment.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/UploadAssignment.css";

const UploadAssignment = ({ courseId, onUploadSuccess, onClose }) => {
  const { user } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }
    // Create form data for multipart file upload
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("courseId", courseId);
    // Use current user's id as uploaderId
    formData.append("uploaderId", user.id);

    try {
      const response = await fetch("http://localhost:8081/api/assignments/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("File upload failed");
      }
      const data = await response.json();
      onUploadSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="upload-assignment-popup">
      <div className="popup-content">
        <h3>Upload Assignment</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
          <div className="btn-group">
            <button type="submit" className="upload-btn">Upload</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadAssignment;
