package com.onlinelearning.online_learning_platform.controller;

import com.onlinelearning.online_learning_platform.entity.Assignment;
import com.onlinelearning.online_learning_platform.service.AssignmentService;
import com.onlinelearning.online_learning_platform.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final EnrollmentService enrollmentService;

    // Endpoint for instructor to upload an assignment
    @PostMapping("/upload")
    public ResponseEntity<?> uploadAssignment(
            @RequestParam Long courseId,
            @RequestParam Long instructorId,
            @RequestParam("file") MultipartFile file) {
        try {
            Assignment assignment = assignmentService.uploadAssignment(courseId, instructorId, file);
            return ResponseEntity.ok(assignment);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File upload failed.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint for students to view assignments (only if enrolled)
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getAssignmentsForCourse(
            @PathVariable Long courseId,
            @RequestParam Long studentId) {
        if (!enrollmentService.isStudentEnrolled(studentId, courseId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Student is not enrolled in this course.");
        }
        List<Assignment> assignments = assignmentService.getAssignmentsByCourse(courseId);
        return ResponseEntity.ok(assignments);
    }

    // Endpoint for instructors to view their own assignments
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<?> getAssignmentsByInstructor(@PathVariable Long instructorId) {
        List<Assignment> assignments = assignmentService.getAssignmentsByInstructor(instructorId);
        return ResponseEntity.ok(assignments);
    }

    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long assignmentId) {
        try {
            assignmentService.deleteAssignment(assignmentId);
            return ResponseEntity.ok("Assignment deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
