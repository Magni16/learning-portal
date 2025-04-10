package com.onlinelearning.online_learning_platform.controller;

import com.onlinelearning.online_learning_platform.entity.Submission;
import com.onlinelearning.online_learning_platform.service.SubmissionService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    // Endpoint for student to submit an assignment
    @PostMapping("/upload")
    @Transactional
    public ResponseEntity<?> submitAssignment(
            @RequestParam Long assignmentId,
            @RequestParam Long studentId,
            @RequestParam("file") MultipartFile file) {
        try {
            Submission submission = submissionService.submitAssignment(assignmentId, studentId, file);
            return ResponseEntity.ok(submission);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Submission upload failed");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint for instructor to view submissions for an assignment
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Submission>> getSubmissionsForAssignment(@PathVariable Long assignmentId) {
        List<Submission> submissions = submissionService.getSubmissionsForAssignment(assignmentId);
        return ResponseEntity.ok(submissions);
    }
}
