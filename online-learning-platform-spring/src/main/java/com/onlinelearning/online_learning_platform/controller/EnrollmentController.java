package com.onlinelearning.online_learning_platform.controller;

import com.onlinelearning.online_learning_platform.entity.Enrollment;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.repository.UserRepository;
import com.onlinelearning.online_learning_platform.repository.EnrollmentRepository;
import com.onlinelearning.online_learning_platform.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for id: " + userId));
        List<Enrollment> enrollments = enrollmentService.getUserEnrollments(user.getId());
        return ResponseEntity.ok(enrollments);
    }

    @PutMapping("/{enrollmentId}/progress/{progress}")
    public ResponseEntity<?> updateProgress(@PathVariable Long enrollmentId,
                                            @PathVariable int progress) {
        try {
            enrollmentService.updateProgress(enrollmentId, progress);
            return ResponseEntity.ok("Progress updated successfully.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    // NEW ENDPOINT: Only superuser can assign a course to a user by email
    @PostMapping("/assign/{courseId}")
    public ResponseEntity<?> assignCourseToUser(@PathVariable Long courseId, @RequestParam String userEmail) {
        try {
            User targetUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
            Enrollment enrollment = enrollmentService.enrollUser(targetUser.getId(), courseId);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/disenroll")
    public ResponseEntity<?> disenrollUser(

            @RequestParam String userEmail,
            @RequestParam Long courseId,
            @RequestParam String performerEmail) {
        try {
            enrollmentService.disenrollUser( userEmail, courseId, performerEmail);
            return ResponseEntity.ok("User disenrolled successfully from the course.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }


    // NEW ENDPOINT: Get all enrollments
    @GetMapping("/all")
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        // This returns all enrollments; each Enrollment should include its id,
        // a nested user object (with email) and a nested course object (with title and id)
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        enrollments.sort((a, b) -> a.getUser().getEmail().compareToIgnoreCase(b.getUser().getEmail()));
        return ResponseEntity.ok(enrollments);
    }


    // Existing endpoints...
}
