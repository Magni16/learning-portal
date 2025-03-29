// /src/components/Videos.js
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/Videos.css";

// Helper function to convert a YouTube URL into an embed URL.
const convertToEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("youtu.be/")) {
    return url.replace("youtu.be/", "www.youtube.com/embed/");
  }
  if (url.includes("embed/")) return url;
  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  return url;
};

const Videos = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [coursesVideos, setCoursesVideos] = useState([]); // Array of { courseId, courseName, videos: [] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Fetch enrollments for the current user
    fetch(`http://localhost:8081/api/enrollments/${user.id}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${t("httpError", "HTTP error! status: ")} ${res.status}`);
        }
        return res.json();
      })
      .then((enrollments) => {
        // Build a mapping of unique courses
        const coursesMap = {};
        enrollments.forEach((enrollment) => {
          const course = enrollment.course;
          if (course && !coursesMap[course.id]) {
            coursesMap[course.id] = { courseId: course.id, courseName: course.title, videos: [] };
          }
        });
        const courseIds = Object.keys(coursesMap);
        if (courseIds.length === 0) return [];
        // For each course, fetch its videos
        return Promise.all(
          courseIds.map((courseId) =>
            fetch(`http://localhost:8081/api/videos/course/${courseId}`)
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`${t("httpError", "HTTP error! status: ")} ${res.status}`);
                }
                return res.json();
              })
              .then((videos) => {
                coursesMap[courseId].videos = Array.isArray(videos) ? videos : [];
              })
          )
        ).then(() => Object.values(coursesMap));
      })
      .then((result) => {
        setCoursesVideos(result);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setError(t("errorFetchingVideos", "Error fetching videos."));
      })
      .finally(() => setLoading(false));
  }, [user, t]);

  return (
    <div className="videos-container">
      <h2>{t("videos", "Videos")}</h2>
      {loading && <p>{t("loadingVideos", "Loading videos...")}</p>}
      {error && <p className="error-message">{error}</p>}
      {coursesVideos.length === 0 ? (
        <p>{t("noVideos", "No videos available for your enrolled courses.")}</p>
      ) : (
        coursesVideos.map((courseGroup) => (
          <div key={courseGroup.courseId} className="course-section">
            <h3>{courseGroup.courseName}</h3>
            {courseGroup.videos.length === 0 ? (
              <p>{t("noVideosForCourse", "No videos available for this course.")}</p>
            ) : (
              <div className="course-videos">
                {courseGroup.videos.map((video) => (
                  <div key={video.videoId} className="video-card">
                    <h4>{video.videoName}</h4>
                    <iframe
                      src={convertToEmbedUrl(video.videoUrl)}
                      title={video.videoName}
                      className="video-frame"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
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
