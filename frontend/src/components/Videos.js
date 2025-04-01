// /src/components/Videos.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/Videos.css";


// Helper function
const convertToEmbedUrl = (url) => {
  if (!url) return "";
  // If it’s a youtu.be short link:
  if (url.includes("youtu.be/")) {
    return url.replace("youtu.be/", "www.youtube.com/embed/");
  }
  // If it already has "embed" in the URL:
  if (url.includes("embed/")) {
    return url;
  }
  // If it’s a standard watch link:
  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  // Fallback
  return url;
};


const Videos = () => {
  const { user } = useContext(AuthContext);
  const [coursesVideos, setCoursesVideos] = useState([]); // Each entry: { course, videos: [] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Fetch enrollments for the current user
    fetch(`http://localhost:8081/api/enrollments/${user.id}`, {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((enrollments) => {
        // Build a mapping of courses the user is enrolled in.
        const coursesMap = {};
        enrollments.forEach((enrollment) => {
          const course = enrollment.course;
          if (course) {
            coursesMap[course.id] = { course, videos: [] };
          }
        });
        const courseIds = Object.keys(coursesMap);
        if (courseIds.length === 0) {
          setCoursesVideos([]);
          setLoading(false);
          return;
        }
        // For each course, fetch its videos.
        Promise.all(
          courseIds.map((courseId) =>
            fetch(`http://localhost:8081/api/videos/course/${courseId}`, { credentials: "include" })
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
              })
              .then((videos) => {
                coursesMap[courseId].videos = Array.isArray(videos) ? videos : [];
              })
          )
        ).then(() => {
          setCoursesVideos(Object.values(coursesMap));
        });
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setError("Error fetching videos.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="videos-container">
      <h2>Course Videos</h2>
      {loading && <p>Loading videos...</p>}
      {error && <p className="error-message">{error}</p>}
      {coursesVideos.length === 0 ? (
        <p>No videos available for your enrolled courses.</p>
      ) : (
        coursesVideos.map(({ course, videos }) => (
          <div key={course.id} className="course-section">
            <h3>{course.title}</h3>
            {videos.length === 0 ? (
              <p>No videos for this course.</p>
            ) : (
              <div className="course-videos">
                {videos.map((video) => (
                  <div key={video.videoId} className="video-card">
                    <h4>{video.videoName}</h4>
                    <iframe
                      src={convertToEmbedUrl(video.videoUrl)}
                      title={video.videoName}
                      className="video-frame"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Videos;
