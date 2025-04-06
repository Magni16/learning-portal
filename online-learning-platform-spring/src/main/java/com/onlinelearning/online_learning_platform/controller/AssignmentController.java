// /src/main/java/com/onlinelearning/online_learning_platform/controller/AssignmentController.java
package com.onlinelearning.online_learning_platform.controller;

import com.onlinelearning.online_learning_platform.entity.Assignment;
import com.onlinelearning.online_learning_platform.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    // Endpoint to upload an assignment (or document)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadAssignment(
            @RequestParam Long courseId,
            @RequestParam Long uploaderId,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            return ResponseEntity.ok(assignmentService.uploadAssignment(courseId, uploaderId, file));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint to get assignments for a course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Assignment>> getAssignmentsForCourse(@PathVariable Long courseId) {
        List<Assignment> assignments = assignmentService.getAssignmentsByCourse(courseId);
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
