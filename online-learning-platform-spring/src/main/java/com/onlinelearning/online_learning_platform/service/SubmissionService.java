// SubmissionService.java
package com.onlinelearning.online_learning_platform.service;

import com.onlinelearning.online_learning_platform.entity.Assignment;
import com.onlinelearning.online_learning_platform.entity.Submission;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.repository.AssignmentRepository;
import com.onlinelearning.online_learning_platform.repository.SubmissionRepository;
import com.onlinelearning.online_learning_platform.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    // Absolute path for storing student submissions.
    private static final String SUBMISSION_UPLOAD_DIR =
            "C:/Users/Kani/online-learning-platform/uploads/submissions/";

    @Transactional
    public Submission submitAssignment(Long assignmentId, Long studentId, MultipartFile file) throws IOException {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + studentId));
        if (!"STUDENT".equals(student.getRole())) {
            throw new RuntimeException("Only students can submit assignments.");
        }
        // Ensure submission directory exists.
        File uploadDir = new File(SUBMISSION_UPLOAD_DIR);
        if (!uploadDir.exists() && !uploadDir.mkdirs()) {
            throw new IOException("Failed to create directory: " + SUBMISSION_UPLOAD_DIR);
        }
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID().toString() + extension;
        String absoluteFilePath = SUBMISSION_UPLOAD_DIR + uniqueFileName;
        file.transferTo(new File(absoluteFilePath));
        // Save relative path (exactly what is mapped in WebConfig)
        String relativeFilePath = "uploads/submissions/" + uniqueFileName;

        Submission submission = new Submission();
        submission.setFileName(originalFileName);
        submission.setFilePath(relativeFilePath);
        submission.setFileType(file.getContentType());
        submission.setUploadTime(LocalDateTime.now());
        submission.setAssignment(assignment);
        submission.setStudent(student);

        Submission savedSubmission = submissionRepository.save(submission);
        submissionRepository.flush();
        return savedSubmission;
    }

    public List<Submission> getSubmissionsForAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        return submissionRepository.findByAssignment(assignment);
    }

    // New: delete a submission by its id.
    public void deleteSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found with id: " + submissionId));
        // Remove the file from disk, if needed.
        File fileOnDisk = new File(SUBMISSION_UPLOAD_DIR + submission.getFilePath().replace("uploads/submissions/", ""));
        if (fileOnDisk.exists()) {
            fileOnDisk.delete();
        }
        submissionRepository.deleteById(submissionId);
    }
}
