import React, { useContext, useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../App.css";
import { AuthContext } from "../contexts/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext); // use authenticated user
  const [enrollments, setEnrollments] = useState(null);
  const [error, setError] = useState(null);

  // Fetch enrollments for the logged-in user using user.id
  useEffect(() => {
    if (!user) return; // wait until user is loaded
    fetch(`http://localhost:8081/api/enrollments/${user.id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setEnrollments(data))
      .catch((err) => setError(err));
  }, [user]);

  if (!user) {
    return <div>Loading user profile...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (enrollments === null) {
    return <div>Loading enrollments...</div>;
  }
  if (!Array.isArray(enrollments)) {
    return <div>Unexpected data format received from API.</div>;
  }

  return (
    <div className="centered-container">
      <h2>Welcome, {user.name}</h2>
      <h3>Your Enrolled Courses</h3>
      {enrollments.length === 0 ? (
        <p>You are not enrolled in any courses.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} style={{ margin: "1rem", width: "200px", textAlign: "center" }}>
              <h4>{enrollment.course.title}</h4>
              <div style={{ width: "100px", margin: "0 auto" }}>
                <CircularProgressbar
                  value={enrollment.progress}
                  text={`${enrollment.progress}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathColor: `rgba(62, 152, 199, ${enrollment.progress / 100})`,
                    textColor: "#000",
                    trailColor: "#d6d6d6",
                  })}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
