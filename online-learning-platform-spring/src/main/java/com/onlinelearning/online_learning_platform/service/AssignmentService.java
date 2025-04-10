package com.onlinelearning.online_learning_platform.service;

import com.onlinelearning.online_learning_platform.entity.Assignment;
import com.onlinelearning.online_learning_platform.entity.Course;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.repository.AssignmentRepository;
import com.onlinelearning.online_learning_platform.repository.CourseRepository;
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
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    // Absolute path for storing assignment files.
    private static final String ASSIGNMENT_UPLOAD_DIR =
            "C:/Users/Kani/online-learning-platform/uploads/assignments/";

    @Transactional
    public Assignment uploadAssignment(Long courseId, Long instructorId, MultipartFile file) throws IOException {
        // Validate that the course exists.
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        // Validate that the instructor exists and has the INSTRUCTOR role.
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + instructorId));
        if (!"INSTRUCTOR".equals(instructor.getRole())) {
            throw new RuntimeException("Only instructors can upload assignments.");
        }

        // Ensure the upload directory exists.
        File uploadDir = new File(ASSIGNMENT_UPLOAD_DIR);
        if (!uploadDir.exists() && !uploadDir.mkdirs()) {
            throw new IOException("Failed to create directory: " + ASSIGNMENT_UPLOAD_DIR);
        }

        // Create a unique filename.
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID().toString() + extension;
        String absoluteFilePath = ASSIGNMENT_UPLOAD_DIR + uniqueFileName;
        file.transferTo(new File(absoluteFilePath));
        // Store relative path for serving via static resources.
        String relativeFilePath = "uploads/assignments/" + uniqueFileName;

        // Create and save the Assignment entity.
        Assignment assignment = new Assignment();
        assignment.setFileName(originalFileName);
        assignment.setFilePath(relativeFilePath);
        assignment.setFileType(file.getContentType());
        assignment.setUploadTime(LocalDateTime.now());
        assignment.setCourse(course);
        assignment.setInstructor(instructor);

        Assignment savedAssignment = assignmentRepository.save(assignment);
        assignmentRepository.flush();
        return savedAssignment;
    }

    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        return assignmentRepository.findByCourse(course);
    }

    public List<Assignment> getAssignmentsByInstructor(Long instructorId) {
        return assignmentRepository.findByInstructor_Id(instructorId);
    }

    public void deleteAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        File fileOnDisk = new File(ASSIGNMENT_UPLOAD_DIR + assignment.getFilePath().replace("uploads/assignments/", ""));
        if (fileOnDisk.exists()) {
            fileOnDisk.delete();
        }
        assignmentRepository.deleteById(assignmentId);
    }
}
