// /src/components/Assignments.js
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UploadAssignment from "./UploadAssignment";
import UploadSubmission from "./UploadSubmission"; // For student submissions
import "../styles/Assignments.css";

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  // This state will map assignment.id to the submission object for that assignment.
  const [visibleSubmissions, setVisibleSubmissions] = useState({});
  const [submissionsByAssignment, setSubmissionsByAssignment] = useState({});
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  // For student submission: track if submission popup is open and for which assignment.
  const [showSubmissionPopup, setShowSubmissionPopup] = useState(false);  // <-- Added this line
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);

  const courseId = 1; // Example course ID; adjust as needed

  useEffect(() => {
    if (!user) return;
    let url = "";
    if (user.role === "INSTRUCTOR") {
      // Instructors get their own assignments.
      url = `http://localhost:8081/api/assignments/instructor/${user.id}`;
    } else if (user.role === "STUDENT") {
      // Students get assignments (requires checking enrollment).
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
        .then((data) => {
          setAssignments(data);
          // If the user is a STUDENT, fetch submissions for each assignment.
          if (user.role === "STUDENT" && data.length > 0) {
            Promise.all(
              data.map((assignment) =>
                fetch(
                  `http://localhost:8081/api/submissions/assignment/${assignment.id}?studentId=${user.id}`,
                  { credentials: "include" }
                )
                  .then((res) => (res.ok ? res.json() : []))
                  .catch(() => [])
              )
            ).then((results) => {
              // For each assignment, if a submission exists, map it by assignment id.
              const submissionsMap = {};
              data.forEach((assignment, idx) => {
                if (results[idx] && results[idx].length > 0) {
                  // Take the first submission, adjust if multiple are allowed.
                  submissionsMap[assignment.id] = results[idx][0];
                }
              });
              setSubmissionsByAssignment(submissionsMap);
            });
          }
        })
        .catch((err) => console.error("Error fetching assignments:", err));
    }
  }, [courseId, user]);

  // Handler for successful assignment upload (for instructors)
  const handleUploadSuccess = (newAssignment) => {
    setAssignments((prev) => [...prev, newAssignment]);
  };

  const toggleSubmissions = async (assignmentId) => {
    if (visibleSubmissions[assignmentId]) {
      setVisibleSubmissions(prev => ({ ...prev, [assignmentId]: null }));
    } else {
      try {
        const res = await fetch(`http://localhost:8081/api/submissions/assignment/${assignmentId}`, {
          credentials: "include"
        });
        const data = await res.json();
        setVisibleSubmissions(prev => ({ ...prev, [assignmentId]: data }));
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      }
    }
  };

  // Handler for successful submission upload (for students)
  const handleSubmissionUploadSuccess = (newSubmission) => {
    setSubmissionsByAssignment((prev) => ({
      ...prev,
      [activeAssignmentId]: newSubmission,
    }));
    setActiveAssignmentId(null);
    setShowSubmissionPopup(false);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;
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

  // Open submission popup for a specific assignment (for students)
  const openSubmissionPopup = (assignmentId) => {
    setActiveAssignmentId(assignmentId);
    setShowSubmissionPopup(true);
  };

  const closeSubmissionPopup = () => {
    setShowSubmissionPopup(false);
    setActiveAssignmentId(null);
  };

  // Helper function to obtain relative file path (assumed to be stored accordingly)
  const getRelativePath = (filePath) => filePath;


  if (!user) {
    return <p>Please log in to view assignments.</p>;
  }

  return (
    <div className="assignments-container">
      <h2>Assignments</h2>
      {/* Instructors see an upload button */}
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
              <a href={`http://localhost:8081/${getRelativePath(assignment.filePath)}`}
               target="_blank"
               rel="noreferrer">
                {assignment.fileName}
              </a>
              <p>Uploaded: {new Date(assignment.uploadTime).toLocaleString()}</p>
              <p>Posted by: {assignment.instructor?.name}</p>
              {(user.role === "INSTRUCTOR" || user.role === "SUPERUSER") &&
                user.id === assignment.instructor?.id && (
                  <button
                    className="delete-assignment-btn"
                    onClick={() => handleDeleteAssignment(assignment.id)}
                  >
                    Delete
                  </button>
              )}
              {user.role === "INSTRUCTOR" && user.id === assignment.instructor?.id && (
                <>
                  <button onClick={() => toggleSubmissions(assignment.id)} className="toggle-submissions-btn">
                    {visibleSubmissions[assignment.id] ? "Hide Submissions" : "View Submissions"}
                  </button>

                  {visibleSubmissions[assignment.id] && (
                    <ul className="submissions-list">
                      {visibleSubmissions[assignment.id].length === 0 ? (
                        <li>No submissions yet.</li>
                      ) : (
                        visibleSubmissions[assignment.id].map((submission) => (
                          <li key={submission.id}>
                            <a href={`http://localhost:8081/${submission.filePath}`} target="_blank" rel="noreferrer">
                              {submission.fileName}
                            </a>{" "}
                            by {submission.student?.name}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </>
              )}
              {/* For STUDENT users, show submission info or "Add Submission" button */}
              {user.role === "STUDENT" && (
                <>
                  {submissionsByAssignment[assignment.id] ? (
                    <div className="submission-info">
                      <p>
                        <strong>Your Submission: </strong>
                        <a
                          href={`http://localhost:8081/${getRelativePath(submissionsByAssignment[assignment.id].filePath)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {submissionsByAssignment[assignment.id].fileName}
                        </a>
                      </p>
                    </div>
                  ) : (
                    <button
                      className="upload-submission-btn"
                      onClick={() => openSubmissionPopup(assignment.id)}
                    >
                      Add Submission
                    </button>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Submission Popup for STUDENT users */}
      {showSubmissionPopup && user.role === "STUDENT" && activeAssignmentId && (
        <UploadSubmission
          assignmentId={activeAssignmentId}
          studentId={user.id}
          onUploadSuccess={handleSubmissionUploadSuccess}
          onClose={closeSubmissionPopup}
        />
      )}
    </div>
  );
};

export default Assignments;
