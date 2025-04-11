package com.onlinelearning.online_learning_platform.controller;

import com.onlinelearning.online_learning_platform.entity.Assignment;
import com.onlinelearning.online_learning_platform.entity.Submission;
import com.onlinelearning.online_learning_platform.repository.AssignmentRepository;
import com.onlinelearning.online_learning_platform.service.SubmissionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.onlinelearning.online_learning_platform.repository.SubmissionRepository;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    
    // Endpoint for student to submit their answer for an assignment.
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

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<?> getSubmissionsForAssignment(
            @PathVariable Long assignmentId,
            @RequestParam(required = false) Long studentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));

        List<Submission> submissions;
        if (studentId != null) {
            // Return only the submission(s) uploaded by this student.
            submissions = submissionRepository.findByAssignmentAndStudent_Id(assignment, studentId);
        } else {
            // Return all submissions for this assignment
            submissions = submissionRepository.findByAssignment(assignment);
        }
        return ResponseEntity.ok(submissions);
    }

}
