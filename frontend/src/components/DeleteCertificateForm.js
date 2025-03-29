// /src/components/DeleteCertificateForm.js
import React, { useState } from "react";
import "../styles/DeleteCertificateForm.css";

const DeleteCertificateForm = ({ setShowDeletePopup, setCertificates, certificates }) => {
  const [userEmail, setUserEmail] = useState("");
  const [certificateId, setCertificateId] = useState("");

  const handleDeleteCertificate = async () => {
    if (!userEmail || !certificateId) {
      alert("Please enter both User Email and Certificate ID.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/certificates/${certificateId}?userEmail=${userEmail}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        alert("Certificate deleted successfully!");
        setCertificates(certificates.filter(cert => cert.certificateId.toString() !== certificateId));
        setShowDeletePopup(false);
      } else {
        const errorText = await response.text();
        alert(`Failed to delete certificate: ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      alert("An error occurred while deleting the certificate.");
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Delete Certificate</h3>
        <label>User Email:</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <label>Certificate ID:</label>
        <input
          type="number"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
        />
         <div className="btn-group">
        <button onClick={handleDeleteCertificate} className="delete-btn">
          Confirm Delete
        </button>
        <button onClick={() => setShowDeletePopup(false)} className="cancel-btn">Cancel</button>
      </div>
      </div>
    </div>
  );
};

export default DeleteCertificateForm;
