package com.onlinelearning.online_learning_platform.service;

import com.onlinelearning.online_learning_platform.entity.Course;
import com.onlinelearning.online_learning_platform.entity.Video;
import com.onlinelearning.online_learning_platform.repository.VideoRepository;
import com.onlinelearning.online_learning_platform.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepository;
    private final CourseRepository courseRepository;

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
}
