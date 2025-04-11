// /src/components/AssignmentDetails.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import UploadSubmission from "./UploadSubmission";
import "../styles/AssignmentDetails.css";

const AssignmentDetails = () => {
  const { assignmentId } = useParams(); // e.g., "/assignments/:assignmentId"
  const { user } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissionUpload, setShowSubmissionUpload] = useState(false);

  useEffect(() => {
    // Fetch assignment details
    fetch(`http://localhost:8081/api/assignments/${assignmentId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch assignment details.");
        }
        return res.json();
      })
      .then((data) => {
        setAssignment(data);
      })
      .catch((err) => console.error("Error fetching assignment:", err));

    // Build the submissions URL.
    let submissionsUrl = `http://localhost:8081/api/submissions/assignment/${assignmentId}`;
    if (user && user.role === "STUDENT") {
      // Append studentId so backend returns only this student's submission.
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
        .then((data) => {
          console.log("Fetched submissions:", data);
          setSubmissions(data);
        })
        .catch((err) => console.error("Error fetching submissions:", err));
    }
  }, [assignmentId, user]);

  const handleSubmissionUploadSuccess = (newSubmission) => {
    // Append the new submission to the list.
    setSubmissions(prev => [...prev, newSubmission]);
    setShowSubmissionUpload(false);
  };

  if (!assignment) {
    return <p>Loading assignment details...</p>;
  }

  // Helper to get relative path (if stored properly in the DB)
  const getRelativePath = (filePath) => filePath;

  return (
    <div className="assignment-details-container">
      <h2>Assignment Details</h2>
      <div className="assignment-info">
        <p>
          <strong>Assignment File: </strong>
          <a
            href={`http://localhost:8081/${getRelativePath(assignment.filePath)}`}
            target="_blank"
            rel="noreferrer"
          >
            {assignment.fileName}
          </a>
        </p>
        <p>
          <strong>Posted on:</strong> {new Date(assignment.uploadTime).toLocaleString()}
        </p>
        <p>
          <strong>Posted by:</strong> {assignment.instructor?.name}
        </p>
      </div>

      {/* Show "Submit Assignment" button only if the logged-in user is a STUDENT */}
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

      {/* Display submissions: for instructors, show all submissions; for students, show their own */}
      <div className="submissions-list">
        <h3>Submissions</h3>
        {submissions.length === 0 ? (
          <p>No submissions available.</p>
        ) : (
          submissions.map((submission) => (
            <div key={submission.id} className="submission-card">
              <a
                href={`http://localhost:8081/${getRelativePath(submission.filePath)}`}
                target="_blank"
                rel="noreferrer"
              >
                {submission.fileName}
              </a>
              <p>Submitted on: {new Date(submission.uploadTime).toLocaleString()}</p>
              <p>Submitted by: {submission.student?.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentDetails;
