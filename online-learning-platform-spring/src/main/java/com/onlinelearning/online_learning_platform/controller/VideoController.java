package com.onlinelearning.online_learning_platform.controller;

import com.onlinelearning.online_learning_platform.entity.Video;
import com.onlinelearning.online_learning_platform.service.VideoService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    // Endpoint for adding a new video (e.g., by a SuperUser)
    @PostMapping("/add")
    public ResponseEntity<?> addVideo(@RequestBody Video videoRequest) {
        // videoRequest should contain courseId, videoName, and videoUrl.
        if (videoRequest.getCourse() == null || videoRequest.getCourse().getId() == null
                || videoRequest.getVideoName() == null || videoRequest.getVideoUrl() == null) {
            return ResponseEntity.badRequest().body("Missing required fields: courseId, videoName, and videoUrl are required.");
        }
        Video addedVideo = videoService.addVideo(
                videoRequest.getCourse().getId(),
                videoRequest.getVideoName(),
                videoRequest.getVideoUrl()
        );
        return ResponseEntity.ok(addedVideo);
    }

    // Endpoint to get videos by course id.
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Video>> getVideosByCourse(@PathVariable Long courseId) {
        List<Video> videos = videoService.getVideosByCourse(courseId);
        return ResponseEntity.ok(videos);
    }

    // Optional: delete video
    @DeleteMapping("/{videoId}")
    public ResponseEntity<?> deleteVideo(@PathVariable Long videoId) {
        videoService.deleteVideo(videoId);
        return ResponseEntity.ok("Video deleted successfully.");
    }

    @GetMapping("/manage")
    public ResponseEntity<List<Video>> getManageVideos(@RequestParam Long userId,
                                                       @RequestParam String role) {
        if (role.equalsIgnoreCase("SUPERUSER")) {
            return ResponseEntity.ok(videoService.getAllVideos());
        } else if (role.equalsIgnoreCase("INSTRUCTOR")) {
            return ResponseEntity.ok(videoService.getVideosForInstructor(userId));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
