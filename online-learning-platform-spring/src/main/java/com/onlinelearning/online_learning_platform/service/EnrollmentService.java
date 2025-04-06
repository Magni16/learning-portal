package com.onlinelearning.online_learning_platform.service;

import com.onlinelearning.online_learning_platform.entity.Course;
import com.onlinelearning.online_learning_platform.entity.Enrollment;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.repository.CourseRepository;
import com.onlinelearning.online_learning_platform.repository.EnrollmentRepository;
import com.onlinelearning.online_learning_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public Enrollment enrollUser(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByUserAndCourse(user, course);
        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("User is already enrolled in this course.");
        }


        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setProgress(0);
        enrollment.setEnrollmentDate(java.time.LocalDate.now());
        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getUserEnrollments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return enrollmentRepository.findByUser(user);
    }

    public void updateProgress(Long enrollmentId, int progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        enrollment.setProgress(progress);
        enrollmentRepository.save(enrollment);
    }

    // NEW: Disenroll a user from a course based on userEmail and courseId.
    // EnrollmentService.java
    public void disenrollUser(String targetUserEmail, Long courseId, String performerEmail) {
        // Retrieve the user performing the action
        User performer = userRepository.findByEmail(performerEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found with email: " + performerEmail));

        // Retrieve the target user (student) to be disenrolled
        User targetUser = userRepository.findByEmail(targetUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + targetUserEmail));

        // Retrieve the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        // Authorization: only allow if performer is SUPERUSER
        // or performer is INSTRUCTOR assigned to the course.
        if (!performer.getRole().equalsIgnoreCase("SUPERUSER") &&
                !(performer.getRole().equalsIgnoreCase("INSTRUCTOR") && course.getUser().getId().equals(performer.getId()))) {
            throw new RuntimeException("Not authorized to disenroll user from this course.");
        }

        // Find the enrollment for the target user and course.
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByUserAndCourse(targetUser, course);
        if (!enrollmentOpt.isPresent()) {
            throw new RuntimeException("Cannot disenroll, user is not enrolled in this course");
        }

        enrollmentRepository.delete(enrollmentOpt.get());
    }


}
