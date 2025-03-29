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

    @PutMapping("/{enrollmentId}/progress/{progress}")
    public ResponseEntity<?> updateProgress(@PathVariable Long enrollmentId,
                                            @PathVariable int progress) {
        return enrollmentRepository.findById(enrollmentId)
                .map(enrollment -> {
                    enrollment.setProgress(progress);
                    enrollmentRepository.save(enrollment);
                    return ResponseEntity.ok("Progress updated successfully.");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Enrollment not found for id: " + enrollmentId));
    }

    // New endpoint to disenroll (remove enrollment)
    @DeleteMapping("/{userId}/{courseId}")
    public ResponseEntity<?> disenrollUser(@PathVariable Long userId, @PathVariable Long courseId) {
        try {
            enrollmentService.disenrollUser(userId, courseId);
            return ResponseEntity.ok("Disenrolled successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
