// /src/components/Courses.js
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Courses.css";
import EnrollUserPopup from "./EnrollUserPopup";
import DisenrollUserTable from "./DisenrollUserTable";

const Courses = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [fadeError, setFadeError] = useState(false);
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [showDisenrollPopup, setShowDisenrollPopup] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Only SUPERUSER and INSTRUCTOR should see available courses.
    if (user && (user.role.toUpperCase() === "SUPERUSER" || user.role.toUpperCase() === "INSTRUCTOR")) {
      fetch(`http://localhost:8081/api/courses/my?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data) {
            setCourses([]);
          } else if (Array.isArray(data)) {
            setCourses(data);
          } else {
            // If a single object is returned, wrap it in an array.
            setCourses([data]);
          }
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
          setCourses([]);
        });
    } else {
      setCourses([]);
    }
  }, [user]);

  const openEnrollPopup = (courseId) => {
    setSelectedCourseId(courseId);
    setShowEnrollPopup(true);
  };

  const handleEnrollUser = async (targetUserEmail) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/enrollments/assign/${selectedCourseId}?userEmail=${encodeURIComponent(
          targetUserEmail
        )}`,
        { method: "POST", credentials: "include" }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || t("enrollmentFailed", "Enrollment failed"));
      }
      await response.json();
      alert(t("enrolledSuccessfully", "Enrolled successfully!"));
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

  return (
    <div className="centered-container">
      {user && (user.role.toUpperCase() === "SUPERUSER" || user.role.toUpperCase() === "INSTRUCTOR") ? (
        <>
          <h2>{t("availableCourses", "Available Courses")}</h2>
          {errorMessage && (
            <div className={`error-message ${fadeError ? "fade-out" : ""}`}>
              {errorMessage}
            </div>
          )}
          <div className="courses-grid">
            {courses.length === 0 ? (
              <p>{t("noCourses", "No courses available.")}</p>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="course-card">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <button onClick={() => openEnrollPopup(course.id)}>
                    {t("enrollButton", "Enroll")}
                  </button>
                </div>
              ))
            )}
          </div>
          <button onClick={() => setShowDisenrollPopup(true)}>
            {t("disenrollUser", "Disenroll User")}
          </button>
        </>
      ) : (
        <>
          <h2>{t("enrolledCourses", "Your Enrolled Courses")}</h2>
          {/* For students, render only their enrolled courses */}
        </>
      )}
      {showEnrollPopup && (
        <EnrollUserPopup
          onSubmit={handleEnrollUser}
          onCancel={() => setShowEnrollPopup(false)}
        />
      )}
      {showDisenrollPopup && (
        <DisenrollUserTable onClose={() => setShowDisenrollPopup(false)} />
      )}
    </div>
  );
};

export default Courses;
