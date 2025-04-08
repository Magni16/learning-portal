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

    private static final String UPLOAD_DIR = "C:/Users/Kani/online-learning-platform/online-learning-platform-spring/src/main/resources/static/uploads/assignments/";

    // annotation so that i dont have to commit after saving
    @Transactional
    public Assignment uploadAssignment(Long courseId, Long uploaderId, MultipartFile file) throws IOException {
        // Retrieve associated course and user.
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        User uploader = userRepository.findById(uploaderId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + uploaderId));

        // Ensure the directory exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists() && !uploadDir.mkdirs()) {
            throw new IOException("Failed to create directory: " + UPLOAD_DIR);
        }

        // Create a unique file name (using UUID)
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID().toString() + extension;
        String absoluteFilePath = UPLOAD_DIR + uniqueFileName;

        file.transferTo(new File(absoluteFilePath));
        String relativeFilePath = "uploads/assignments/" + uniqueFileName;

        Assignment assignment = new Assignment();
        assignment.setFileName(originalFileName);
        assignment.setFilePath(relativeFilePath); // Store relative path in the database

        assignment.setFileType(file.getContentType());
        assignment.setUploadTime(LocalDateTime.now());
        assignment.setCourse(course);
        assignment.setInstructor(uploader); 

        Assignment savedAssignment = assignmentRepository.save(assignment);
        assignmentRepository.flush();
        System.out.println("Saved assignment with id: " + savedAssignment.getId());
        return savedAssignment;
    }


    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        return assignmentRepository.findByCourse(course);
    }

    public void deleteAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));

        // Optionally remove the file from disk
        File fileOnDisk = new File(assignment.getFilePath());
        if (fileOnDisk.exists()) {
            fileOnDisk.delete();  // handle possible failure if needed
        }

        // Remove the record from the database
        assignmentRepository.deleteById(assignmentId);
    }
}
