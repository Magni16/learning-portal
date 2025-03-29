import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Courses.css";
import DisenrollUserTable from "./DisenrollUserTable";
import EnrollUserPopup from "./EnrollUserPopup"; // Import the new popup

const Courses = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [fadeError, setFadeError] = useState(false);
  const [showDisenrollPopup, setShowDisenrollPopup] = useState(false);
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));

    if (user) {
      fetch(`http://localhost:8081/api/enrollments/${user.id}`)
        .then((res) => res.json())
        .then((data) =>
          setEnrolledCourses(data.map((enrollment) => enrollment.course.id))
        );
    }
  }, [user]);

  // For Bob only: open the enroll popup for a given course
  const openEnrollPopup = (courseId) => {
    setSelectedCourseId(courseId);
    setShowEnrollPopup(true);
  };

  // Handle enrolling a user (only available to Bob)
  const handleEnrollUser = async (targetUserEmail) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/enrollments/assign/${selectedCourseId}?userEmail=${targetUserEmail}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || t("enrollmentFailed", "Enrollment failed"));
      }
      const enrollment = await response.json();
      alert(t("enrolledSuccessfully", "Enrolled successfully!"));
      setEnrolledCourses([...enrolledCourses, selectedCourseId]);
      setShowEnrollPopup(false);
    } catch (err) {
      console.error("Enrollment error:", err);
      setErrorMessage(err.message);
      setFadeError(false);
      setTimeout(() => {
        setFadeError(true);
        setTimeout(() => setErrorMessage(""), 1000);
      }, 4000);
    }
  };

  // Only show available courses if user is Bob (SUPERUSER)
  return (
    <div className="centered-container">
      {user && user.email.toLowerCase() === "bob@example.com" ? (
        <>
          <h2>{t("availableCourses", "Available Courses")}</h2>
          {errorMessage && (
            <div className={`error-message ${fadeError ? "fade-out" : ""}`}>
              {errorMessage}
            </div>
          )}
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <button onClick={() => openEnrollPopup(course.id)}>
                  {t("enrollButton", "Enroll")}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2>{t("enrolledCourses", "Your Enrolled Courses")}</h2>
          {/* Render enrolled courses for non-superusers */}
        </>
      )}
      {user && user.email.toLowerCase() === "bob@example.com" && (
        <button onClick={() => setShowDisenrollPopup(true)}>
          {t("disenrollUser", "Disenroll User")}
        </button>
      )}
      {showDisenrollPopup && (
        <DisenrollUserTable onClose={() => setShowDisenrollPopup(false)} />
      )}
      {showEnrollPopup && (
        <EnrollUserPopup
          onSubmit={handleEnrollUser}
          onCancel={() => setShowEnrollPopup(false)}
        />
      )}
    </div>
  );
};

export default Courses;
