// /src/components/DisenrollUserTable.js
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/DisenrollUserTable.css";

const DisenrollUserTable = ({ onClose }) => {
  const { t } = useTranslation();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8081/api/enrollments/all", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEnrollments(data);
        } else {
          console.error("Expected array but got:", data);
          setEnrollments([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching enrollments:", err);
        setError(t("errorFetchingEnrollments", "Error fetching enrollments."));
      })
      .finally(() => setLoading(false));
  }, [t]);

  const handleDisenroll = (userEmail, courseId) => {
    fetch(
      `http://localhost:8081/api/enrollments/disenroll?userEmail=${encodeURIComponent(
        userEmail
      )}&courseId=${courseId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text || t("disenrollFailed", "Failed to disenroll user."));
          });
        }
        return res.text();
      })
      .then((msg) => {
        alert(msg);
        setEnrollments((prev) =>
          prev.filter(
            (enrollment) =>
              !(enrollment.course.id === courseId &&
                enrollment.user.email.toLowerCase() === userEmail.toLowerCase())
          )
        );
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{t("disenrollEnrollments", "Disenroll Enrollments")}</h3>
        {loading && <p>{t("loading", "Loading...")}</p>}
        {error && <p className="error-message">{error}</p>}
        {enrollments.length === 0 ? (
          <p>{t("noEnrollments", "No enrollments found.")}</p>
        ) : (
          <table className="enrollment-table">
            <thead>
              <tr>
                <th>{t("userEmail", "User Email")}</th>
                <th>{t("courseTitle", "Course Title")}</th>
                <th>{t("actions", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td>{enrollment.user.email}</td>
                  <td>{enrollment.course.title}</td>
                  <td>
                    <button
                      className="disenroll-btn"
                      onClick={() =>
                        handleDisenroll(enrollment.user.email, enrollment.course.id)
                      }
                    >
                      {t("disenroll", "Disenroll")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="cancel-btn" onClick={onClose}>
          {t("close", "Close")}
        </button>
      </div>
    </div>
  );
};

export default DisenrollUserTable;
