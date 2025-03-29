// /src/components/Enrollments.js
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import "../styles/Enrollments.css";

const Enrollments = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [enrollments, setEnrollments] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:8081/api/enrollments/${user.id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${t("httpError", "HTTP error! status: ")} ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setEnrollments(data))
      .catch((err) => {
        setError(err);
        setEnrollments([]);
      });
  }, [user, t]);

  const updateProgress = (enrollmentId, currentProgress, increase = true) => {
    let newProgress = increase ? currentProgress + 10 : currentProgress - 10;
    if (newProgress > 100) {
      alert(t("courseCompleted", "Course is already completed"));
      return;
    }
    if (newProgress < 0) {
      alert(t("progressZero", "Progress is already at 0%"));
      return;
    }

    const url = `http://localhost:8081/api/enrollments/${enrollmentId}/progress/${newProgress}`;
    fetch(url, { method: "PUT", credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text || t("updateProgressFailed", "Failed to update progress."));
          });
        }
        return res.text();
      })
      .then((message) => {
        alert(message);
        // Refresh enrollments after update
        fetch(`http://localhost:8081/api/enrollments/${user.id}`, { credentials: "include" })
          .then((res) => res.json())
          .then((data) => setEnrollments(data));
      })
      .catch((err) => alert(t("updateProgressError", "Error updating progress: ") + err.message));
  };

  if (!user) {
    return <div className="enrollments-container">{t("loadingUser", "Loading user...")}</div>;
  }
  if (error) {
    return <div className="enrollments-container">{t("error", "Error: ")}{error.message}</div>;
  }
  if (enrollments === null) {
    return <div className="enrollments-container">{t("loadingEnrollments", "Loading enrollments...")}</div>;
  }
  if (!Array.isArray(enrollments)) {
    return <div className="enrollments-container">{t("unexpectedData", "Unexpected data format received from API.")}</div>;
  }

  return (
    <div className="enrollments-container">
      <h2>{t("enrolledCourses", "Your Enrolled Courses")}</h2>
      {enrollments.length === 0 ? (
        <p>{t("noEnrollmentsFound", "No enrollments found.")}</p>
      ) : (
        <div className="enrollments-grid">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="enrollment-card">
              <h3>{enrollment.course.title}</h3>
              <p>{t("progress", "Progress: ")}{enrollment.progress}%</p>
              <div className="progress-buttons">
                <button
                  className="increase-btn"
                  onClick={() => updateProgress(enrollment.id, enrollment.progress, true)}
                >
                  {t("increaseProgress", "Increase Progress")}
                </button>
                <button
                  className="decrease-btn"
                  onClick={() => updateProgress(enrollment.id, enrollment.progress, false)}
                >
                  {t("decreaseProgress", "Decrease Progress")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Enrollments;
