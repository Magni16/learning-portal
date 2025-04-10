// /src/components/UploadSubmission.js
import React, { useState } from "react";

const UploadSubmission = ({ assignmentId, studentId, onUploadSuccess, onClose }) => {
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
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", studentId);

    try {
      const response = await fetch("http://localhost:8081/api/submissions/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Submission upload failed");
      }
      const data = await response.json();
      onUploadSuccess(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="upload-submission-popup">
      <div className="popup-content">
        <h3>Submit Your Assignment</h3>
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

export default UploadSubmission;
