import React, { useState } from "react";
import "../styles/EnrollUserPopup.css";

const EnrollUserPopup = ({ onSubmit, onCancel }) => {
  const [targetUserEmail, setTargetUserEmail] = useState("");

  const handleSubmit = () => {
    if (!targetUserEmail) {
      alert("Please enter a user email.");
      return;
    }
    onSubmit(targetUserEmail);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Assign Course to User</h3>
        <div className="form-group">
          <label>User Email:</label>
          <input
            type="email"
            value={targetUserEmail}
            onChange={(e) => setTargetUserEmail(e.target.value)}
            placeholder="Enter user's email"
          />
        </div>
        <div className="modal-buttons">
          <button className="add-btn" onClick={handleSubmit}>
            Assign
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollUserPopup;
