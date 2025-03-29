// /src/components/AddCertificate.js
import React, { useState } from "react";
import "../styles/AddCertificate.css"; // Make sure this path is correct

const AddCertificate = ({ setShowAddPopup, onAdd }) => {
  const [userEmail, setUserEmail] = useState("");
  const [name, setName] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  const handleAddCertificate = async () => {
    if (!userEmail || !name || !certificateUrl) {
      alert("⚠️ All fields are required!");
      return;
    }

    const newCertificate = {
      userEmail,
      name,
      certificateUrl,
    };

    try {
      const response = await fetch("http://localhost:8081/api/certificates/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCertificate),
      });

      if (response.ok) {
        const addedCertificate = await response.json();
        onAdd(addedCertificate);
        setShowAddPopup(false);
        alert("Certificate added successfully!");
      } else {
        const errorText = await response.text();
        alert(`Failed to add certificate: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding certificate:", error);
      alert("An error occurred while adding the certificate.");
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Add Certificate</h3>
        <label>User Email:</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        <label>Certificate Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Certificate URL:</label>
        <input
          type="text"
          value={certificateUrl}
          onChange={(e) => setCertificateUrl(e.target.value)}
          required
        />

        <div className="btn-group">
          <button onClick={handleAddCertificate} className="add-btn">
            Add Certificate
          </button>
          <button onClick={() => setShowAddPopup(false)} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCertificate;
