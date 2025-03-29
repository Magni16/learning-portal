package com.onlinelearning.online_learning_platform.service;

import com.onlinelearning.online_learning_platform.entity.Enrollment;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.entity.Course;
import com.onlinelearning.online_learning_platform.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.onlinelearning.online_learning_platform.repository.CourseRepository;
import com.onlinelearning.online_learning_platform.repository.UserRepository;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public Enrollment enrollUser(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setProgress(0);
        enrollment.setEnrollmentDate(LocalDate.now());
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

    // New method: Disenroll user from a course
    public void disenrollUser(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        Enrollment enrollment = enrollmentRepository.findByUserAndCourse(user, course)
                .orElseThrow(() -> new RuntimeException("Enrollment not found for the given user and course."));
        enrollmentRepository.delete(enrollment);
    }
}
