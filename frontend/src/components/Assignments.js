// /src/components/Assignments.js
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UploadAssignment from "./UploadAssignment";
import "../styles/Assignments.css";

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const courseId = 1; // Example course ID; adjust as needed

  useEffect(() => {
    if (!user) return;
    let url = "";

    if (user.role === "INSTRUCTOR") {
      // Instructors get only their own assignments
      url = `http://localhost:8081/api/assignments/instructor/${user.id}`;
    } else if (user.role === "STUDENT") {
      // Students get assignments for a course if they are enrolled (backend must check enrollment)
      url = `http://localhost:8081/api/assignments/course/${courseId}?studentId=${user.id}`;
    }

    if (url) {
      fetch(url, { credentials: "include" })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch assignments");
          }
          return res.json();
        })
        .then((data) => setAssignments(data))
        .catch((err) => console.error("Error fetching assignments:", err));
    }
  }, [courseId, user]);

  const handleUploadSuccess = (newAssignment) => {
    setAssignments((prev) => [...prev, newAssignment]);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const response = await fetch(`http://localhost:8081/api/assignments/${assignmentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete assignment");
      }
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert(error.message);
    }
  };

  // Helper to return the relative file path; assuming your backend now stores a relative path like "uploads/assignments/..."
  const getRelativePath = (filePath) => filePath;

  if (!user) {
    return <p>Please log in to view assignments.</p>;
  }

  return (
    <div className="assignments-container">
      <h2>Assignments</h2>
      {/* Instructors see an upload button to post new assignments */}
      {user.role === "INSTRUCTOR" && (
        <button onClick={() => setShowUploadPopup(true)} className="upload-assignment-btn">
          Upload Assignment
        </button>
      )}
      {showUploadPopup && user.role === "INSTRUCTOR" && (
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
          assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <a
                href={`http://localhost:8081/${getRelativePath(assignment.filePath)}`}
                target="_blank"
                rel="noreferrer"
              >
                {assignment.fileName}
              </a>
              <p>Uploaded: {new Date(assignment.uploadTime).toLocaleString()}</p>
              <p>Posted by: {assignment.instructor?.name}</p>
              {/* Allow delete if the logged-in instructor is the one who posted the assignment or if SUPERUSER */}
              {(user.role === "INSTRUCTOR" || user.role === "SUPERUSER") &&
                user.id === assignment.instructor?.id && (
                  <button
                    className="delete-assignment-btn"
                    onClick={() => handleDeleteAssignment(assignment.id)}
                  >
                    Delete
                  </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Assignments;
