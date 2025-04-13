// /src/components/AssignmentDetails.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import UploadSubmission from "./UploadSubmission";
import "../styles/AssignmentDetails.css";

const AssignmentDetails = () => {
  const { assignmentId } = useParams();
  const { user } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissionUpload, setShowSubmissionUpload] = useState(false);

  useEffect(() => {
    // Fetch assignment details.
    fetch(`http://localhost:8081/api/assignments/${assignmentId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch assignment details.");
        }
        return res.json();
      })
      .then((data) => setAssignment(data))
      .catch((err) => console.error("Error fetching assignment:", err));

    // Build the submissions URL.
    let submissionsUrl = `http://localhost:8081/api/submissions/assignment/${assignmentId}`;
    if (user && user.role === "STUDENT") {
      submissionsUrl += `?studentId=${user.id}`;
    }
    if (user) {
      fetch(submissionsUrl, { credentials: "include" })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch submissions.");
          }
          return res.json();
        })
        .then((data) => setSubmissions(data))
        .catch((err) => console.error("Error fetching submissions:", err));
    }
  }, [assignmentId, user]);

  const handleSubmissionUploadSuccess = (newSubmission) => {
    setSubmissions((prev) => [...prev, newSubmission]);
    setShowSubmissionUpload(false);
  };

  // New: Handler for deleting a submission (for instructors).
  const handleDeleteSubmission = async (submissionId) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      const response = await fetch(`http://localhost:8081/api/submissions/${submissionId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete submission");
      }
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert(error.message);
    }
  };

  const getRelativePath = (filePath) => filePath;

  if (!assignment) {
    return <p>Loading assignment details...</p>;
  }

  return (
    <div className="assignment-details-container">
      <h2>Assignment Details</h2>
      <div className="assignment-info">
        <p>
          <strong>Assignment File: </strong>
          <a href={`http://localhost:8081/${getRelativePath(assignment.filePath)}`}
             target="_blank"
             rel="noreferrer">
            {assignment.fileName}
          </a>
        </p>
        <p><strong>Posted on:</strong> {new Date(assignment.uploadTime).toLocaleString()}</p>
        <p><strong>Posted by:</strong> {assignment.instructor?.name}</p>
      </div>

      {user && user.role === "STUDENT" && (
        <>
          <button onClick={() => setShowSubmissionUpload(true)} className="upload-submission-btn">
            Submit Assignment
          </button>
          {showSubmissionUpload && (
            <UploadSubmission
              assignmentId={assignmentId}
              studentId={user.id}
              onUploadSuccess={handleSubmissionUploadSuccess}
              onClose={() => setShowSubmissionUpload(false)}
            />
          )}
        </>
      )}

      <div className="submissions-list">
        <h3>Submissions</h3>
        {submissions.length === 0 ? (
          <p>No submissions available.</p>
        ) : (
          submissions.map((submission) => (
            <div key={submission.id} className="submission-card">
              <a href={`http://localhost:8081/${getRelativePath(submission.filePath)}`}
                 target="_blank"
                 rel="noreferrer">
                {submission.fileName}
              </a>
              <p>Submitted on: {new Date(submission.uploadTime).toLocaleString()}</p>
              <p>Submitted by: {submission.student?.name}</p>
              {user && user.role === "INSTRUCTOR" && (
                <button
                  className="delete-submission-btn"
                  onClick={() => handleDeleteSubmission(submission.id)}
                >
                  Delete Submission
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentDetails;
