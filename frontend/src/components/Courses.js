import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Courses.css";

const Courses = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [fadeError, setFadeError] = useState(false);
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

  const enrollUser = (courseId) => {
    if (!user) {
      alert(t("userNotAuthenticated", "User not authenticated"));
      return;
    }

    // Check if already enrolled
    if (enrolledCourses.includes(courseId)) {
      setErrorMessage("You have already enrolled in this course.");
      setFadeError(false);
      // After 4 seconds, trigger fade out, then clear error after 1 more second
      setTimeout(() => {
        setFadeError(true);
        setTimeout(() => setErrorMessage(""), 1000);
      }, 4000);
      return;
    }

    fetch(`http://localhost:8081/api/enrollments/${user.id}/${courseId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text || t("enrollmentFailed", "Enrollment failed"));
          });
        }
        return res.json();
      })
      .then(() => {
        alert(t("enrolledSuccessfully", "Enrolled successfully!"));
        setEnrolledCourses([...enrolledCourses, courseId]);
        setErrorMessage("");
        navigate("/enrollments");
      })
      .catch((err) => {
        console.error("Enrollment error:", err);
        setErrorMessage(err.message);
        setFadeError(false);
        setTimeout(() => {
          setFadeError(true);
          setTimeout(() => setErrorMessage(""), 1000);
        }, 4000);
      });
  };

  return (
    <div className="centered-container">
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
            <button onClick={() => enrollUser(course.id)}>
              {t("enrollButton", "Enroll")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
