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
    // Fetch videos for management.
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

  // Helper function to validate URL based on allowed prefixes.
  const isValidVideoUrl = (url) => {
    const allowedPrefixes = [
      "https://youtu.be",
      "http://youtu.be",
      "https://drive.google.com",
      "http://drive.google.com"
    ];
    return allowedPrefixes.some(prefix => url.startsWith(prefix));
  };

  const handleAddVideoSubmit = (e) => {
    e.preventDefault();

    // Check if all fields are provided.
    if (!newVideo.courseId || !newVideo.videoName || !newVideo.videoUrl) {
      alert("Please fill all fields.");
      return;
    }

    // Validate courseId is a number.
    if (isNaN(newVideo.courseId)) {
      alert("Course ID must be a valid number.");
      return;
    }

    // Validate video URL starts with an allowed prefix.
    if (!isValidVideoUrl(newVideo.videoUrl)) {
      alert("Video URL must start with 'https://youtu.be', 'http://youtu.be', 'https://drive.google.com', or 'http://drive.google.com'");
      return;
    }

    // For INSTRUCTOR, pass userId; for SUPERUSER, do not.
    const addVideoUrl =
      user.role === "INSTRUCTOR"
        ? `http://localhost:8081/api/videos/add?userId=${user.id}`
        : `http://localhost:8081/api/videos/add`;

    fetch(addVideoUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        videoName: newVideo.videoName,
        videoUrl: newVideo.videoUrl,
        course: { id: newVideo.courseId }
      })
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => { throw new Error(text) });
        }
        return res.json();
      })
      .then((addedVideo) => {
        setVideos((prev) => [...prev, addedVideo]);
        setNewVideo({ courseId: "", videoName: "", videoUrl: "" });
        setShowForm(false);
      })
      .catch((err) => {
        console.error("Error adding video:", err);
        alert(err.message || "Error adding video.");
      });
  };

  // Function to delete a video.
  const handleDeleteVideo = (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      fetch(`http://localhost:8081/api/videos/${videoId}`, {
        method: "DELETE",
        credentials: "include"
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          // Remove the video from the list after successful deletion.
          setVideos((prev) => prev.filter(video => video.videoId !== videoId));
        })
        .catch((err) => {
          console.error("Error deleting video:", err);
          alert("Error deleting video.");
        });
    }
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
              {user && user.role === "SUPERUSER" && <th>Actions</th>}
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
                {user && user.role === "SUPERUSER" && (
                  <td>
                    <button onClick={() => handleDeleteVideo(video.videoId)}>
                      Delete Video
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageVideos;
