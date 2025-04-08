// /src/components/Assignments.js
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UploadAssignment from "./UploadAssignment";
import "../styles/Assignments.css";

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const courseId = 1; // Example course ID

  useEffect(() => {
    fetch(`http://localhost:8081/api/assignments/course/${courseId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .catch((err) => console.error("Error fetching assignments:", err));
  }, [courseId]);

  const handleUploadSuccess = (newAssignment) => {
    setAssignments([...assignments, newAssignment]);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8081/api/assignments/${assignmentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete assignment");
      }
      setAssignments(assignments.filter((a) => a.id !== assignmentId));
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert(error.message);
    }
  };

  // If user is not logged in, display a message
  if (!user) {
    return <p>Please log in to view assignments.</p>;
  }

  // Helper function (if needed) to compute the relative path from the stored filePath.
  const getRelativePath = (absolutePath) => {
    const marker = "/static/";
    const index = absolutePath.indexOf(marker);
    if (index !== -1) {
      return absolutePath.substring(index + marker.length);
    }
    return absolutePath;
  };

  return (
    <div className="assignments-container">
      <h2>Assignments</h2>
      <button onClick={() => setShowUploadPopup(true)} className="upload-assignment-btn">
        Upload Assignment
      </button>
      {showUploadPopup && (
        <UploadAssignment
          courseId={courseId}
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setShowUploadPopup(false)}
        />
      )}
      <div className="assignments-list">
        {assignments.length === 0 ? (
          <p>No assignments available.</p>
        ) : (
          assignments.map((assignment) => {
            // Convert absolute path to relative if needed
            const relativePath = getRelativePath(assignment.filePath);
            return (
              <div key={assignment.id} className="assignment-card">
                <a
                  href={`http://localhost:8081/${relativePath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {assignment.fileName}
                </a>
                <p>Uploaded: {new Date(assignment.uploadTime).toLocaleString()}</p>
                {/* Ensure we reference assignment.instructor instead of assignment.uploader */}
                <p>Uploaded by: {assignment.instructor?.name || "Unknown"}</p>

                {/* Show Delete button only for superuser or the instructor who posted it */}
                {(user.role === "SUPERUSER" || user.id === assignment.instructor?.id) && (
                  <button
                    className="delete-assignment-btn"
                    onClick={() => handleDeleteAssignment(assignment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Assignments;
