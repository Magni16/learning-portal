// /src/components/AddCourse.js
import React, { useState } from "react";
import "../styles/AddCourse.css";

const AddCourse = ({ onClose, onCourseAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !instructor || !userId) {
      setError("Please fill in all fields.");
      return;
    }

    const courseData = {
      title,
      description,
      instructor,
      price: 0, // default value
      user: { id: parseInt(userId, 10) } // assuming the backend expects a nested user object
    };

    fetch("http://localhost:8081/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(courseData)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add course");
        }
        return res.json();
      })
      .then((data) => {
        onCourseAdded(data);
        onClose();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="add-course-popup">
      <div className="popup-content">
        <h3>Add Course</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Title of Course:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            Course Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            Instructor Name:
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
            />
          </label>
          <label>
            User ID:
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </label>
          <div className="btn-group">
            <button type="submit" className="add-btn">
              Add Course
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
