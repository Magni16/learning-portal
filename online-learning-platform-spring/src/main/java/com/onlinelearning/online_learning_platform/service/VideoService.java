package com.onlinelearning.online_learning_platform.service;

import com.onlinelearning.online_learning_platform.entity.Course;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.entity.Video;
import com.onlinelearning.online_learning_platform.repository.VideoRepository;
import com.onlinelearning.online_learning_platform.repository.CourseRepository;
import com.onlinelearning.online_learning_platform.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository; // Added


    // New: Get all videos for SUPERUSER.
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    // Add a new video to a course.
    public Video addVideo(Long courseId, String videoName, String videoUrl) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        Video video = new Video();
        video.setVideoName(videoName);
        video.setVideoUrl(videoUrl);
        video.setCourse(course);
        return videoRepository.save(video);
    }

    // Retrieve videos for a given course.
    public List<Video> getVideosByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        return videoRepository.findByCourse(course);
    }

    // Optionally, add a delete method (if needed)
    public void deleteVideo(Long videoId) {
        videoRepository.deleteById(videoId);
    }

    // New: Get videos for an instructor (by filtering courses created by the instructor).
    public List<Video> getVideosForInstructor(Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + instructorId));
        List<Course> courses = courseRepository.findByUser(instructor);
        List<Video> videos = new ArrayList<>();
        for (Course course : courses) {
            videos.addAll(videoRepository.findByCourse(course));
        }
        return videos;
    }
}
