// /src/components/AssignmentDetails.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import UploadSubmission from "./UploadSubmission";

const AssignmentDetails = () => {
  const { assignmentId } = useParams();
  const { user } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissionUpload, setShowSubmissionUpload] = useState(false);

  useEffect(() => {
    // Fetch the assignment details.
    fetch(`http://localhost:8081/api/assignments/${assignmentId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setAssignment(data))
      .catch((err) => console.error("Error fetching assignment:", err));

    // If the user is an instructor, fetch submissions for this assignment.
    if (user && user.role === "INSTRUCTOR") {
      fetch(`http://localhost:8081/api/submissions/assignment/${assignmentId}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setSubmissions(data))
        .catch((err) => console.error("Error fetching submissions:", err));
    }
  }, [assignmentId, user]);

  const handleSubmissionUploadSuccess = (newSubmission) => {
    setSubmissions(prev => [...prev, newSubmission]);
    setShowSubmissionUpload(false);
  };

  if (!assignment) {
    return <p>Loading assignment details...</p>;
  }

  return (
    <div className="assignment-details-container">
      <h2>Assignment Details</h2>
      <div className="assignment-info">
        <p>
          <strong>Assignment File: </strong>
          <a
            href={`http://localhost:8081/${assignment.filePath}`}
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

      {user && user.role === "INSTRUCTOR" && (
        <div className="submissions-list">
          <h3>Student Submissions</h3>
          {submissions.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <a
                  href={`http://localhost:8081/${submission.filePath}`}
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
      )}
    </div>
  );
};

export default AssignmentDetails;
