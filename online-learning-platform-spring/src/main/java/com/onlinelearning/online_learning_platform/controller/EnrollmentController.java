package com.onlinelearning.online_learning_platform.controller;

import com.onlinelearning.online_learning_platform.entity.Enrollment;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.repository.EnrollmentRepository;
import com.onlinelearning.online_learning_platform.repository.UserRepository;
import com.onlinelearning.online_learning_platform.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @PostMapping("/{userId}/{courseId}")
    public ResponseEntity<?> enrollUser(@PathVariable Long userId, @PathVariable Long courseId) {
        try {
            Enrollment enrollment = enrollmentService.enrollUser(userId, courseId);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserEnrollments(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found for id: " + userId);
        }
        List<Enrollment> enrollments = enrollmentRepository.findByUser(userOpt.get());
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping
    public ResponseEntity<?> getEnrollmentsDefault() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("User ID is required. Please use /api/enrollments/{userId} to fetch enrollments.");
    }

    @PutMapping("/{enrollmentId}/progress/{progress}")
    public ResponseEntity<?> updateProgress(@PathVariable Long enrollmentId,
                                            @PathVariable int progress) {
        return enrollmentRepository.findById(enrollmentId)
                .map(enrollment -> {
                    if (enrollment.getProgress() >= 100) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Course is already completed.");
                    }
                    int newProgress = Math.min(progress, 100); // Ensures progress does not exceed 100
                    enrollment.setProgress(newProgress);
                    enrollmentRepository.save(enrollment);
                    return ResponseEntity.ok("Progress updated successfully.");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Enrollment not found for id: " + enrollmentId));
    }

    @PutMapping("/{enrollmentId}/progress/decrease/{progress}")
    public ResponseEntity<?> decreaseProgress(@PathVariable Long enrollmentId,
                                              @PathVariable int progress) {
        return enrollmentRepository.findById(enrollmentId)
                .map(enrollment -> {
                    if (enrollment.getProgress() <= 0) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Progress is already at 0%.");
                    }
                    int newProgress = Math.max(enrollment.getProgress() - progress, 0); // Ensure progress doesn't go below 0
                    enrollment.setProgress(newProgress);
                    enrollmentRepository.save(enrollment);
                    return ResponseEntity.ok("Progress decreased successfully.");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Enrollment not found for id: " + enrollmentId));
    }
}
