// /src/components/UploadAssignment.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/UploadAssignment.css";

const UploadAssignment = ({ courseId, onUploadSuccess, onClose }) => {
  const { user } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    // Build the FormData object
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("courseId", courseId);
    // Pass the instructorId from the logged-in user (ensure user exists and role is INSTRUCTOR)
    if (user && user.role === "INSTRUCTOR") {
      formData.append("instructorId", user.id);
    } else {
      setError("Only instructors can upload assignments.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/assignments/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }
      const data = await response.json();
      onUploadSuccess(data);
      onClose();
    } catch (err) {
      console.error("Error during file upload:", err);
      setError(err.message);
    }
  };

  return (
    <div className="upload-assignment-popup">
      <div className="popup-content">
        <h3>Upload Assignment</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
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
