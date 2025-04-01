// /src/components/ManageVideos.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/ManageVideos.css";

const ManageVideos = () => {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    courseId: "",
    videoName: "",
    videoUrl: ""
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Call the new management endpoint.
    fetch(`http://localhost:8081/api/videos/manage?userId=${user.id}&role=${user.role}`, {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setVideos(data);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setError("Error fetching videos.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleAddVideoChange = (e) => {
    const { name, value } = e.target;
    setNewVideo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVideoSubmit = (e) => {
    e.preventDefault();
    // Validate newVideo fields before submission.
    if (!newVideo.courseId || !newVideo.videoName || !newVideo.videoUrl) {
      alert("Please fill all fields.");
      return;
    }
    fetch("http://localhost:8081/api/videos/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        videoName: newVideo.videoName,
        videoUrl: newVideo.videoUrl,
        course: { id: newVideo.courseId }  // Nested course object with id.
      })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((addedVideo) => {
        // Refresh the list after adding.
        setVideos((prev) => [...prev, addedVideo]);
        setNewVideo({ courseId: "", videoName: "", videoUrl: "" });
        setShowForm(false);
      })
      .catch((err) => {
        console.error("Error adding video:", err);
        alert("Error adding video.");
      });
  };

  return (
    <div className="manage-videos-container">
      <h2>Manage Videos</h2>
      {loading && <p>Loading videos...</p>}
      {error && <p className="error-message">{error}</p>}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Video"}
      </button>
      {showForm && (
        <form className="add-video-form" onSubmit={handleAddVideoSubmit}>
          <label>
            Course ID:
            <input
              type="text"
              name="courseId"
              value={newVideo.courseId}
              onChange={handleAddVideoChange}
            />
          </label>
          <label>
            Video Name:
            <input
              type="text"
              name="videoName"
              value={newVideo.videoName}
              onChange={handleAddVideoChange}
            />
          </label>
          <label>
            Video URL:
            <input
              type="text"
              name="videoUrl"
              value={newVideo.videoUrl}
              onChange={handleAddVideoChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <table className="videos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Video Name</th>
              <th>Video URL</th>
              <th>Course Title</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.videoId}>
                <td>{video.videoId}</td>
                <td>{video.videoName}</td>
                <td>
                  <a href={video.videoUrl} target="_blank" rel="noreferrer">
                    {video.videoUrl}
                  </a>
                </td>
                <td>{video.course ? video.course.title : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageVideos;
