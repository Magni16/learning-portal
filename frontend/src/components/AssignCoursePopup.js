// /src/components/AssignCoursePopup.js
import React, { useState } from "react";
import "../styles/AssignCoursePopup.css"; // Create this file for styling

const AssignCoursePopup = ({ courseId, onClose, onAssign }) => {
  const [userEmail, setUserEmail] = useState("");

  const handleAssign = async () => {
    if (!userEmail) {
      alert("Please enter a user email.");
      return;
    }
    await onAssign(courseId, userEmail);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Assign Course</h3>
        <div className="form-group">
          <label>User Email:</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter user's email"
          />
        </div>
        <div className="modal-buttons">
          <button onClick={handleAssign} className="add-btn">Assign</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AssignCoursePopup;
