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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public Enrollment enrollUser(Long userId, Long courseId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Course> courseOpt = courseRepository.findById(courseId);

        if (userOpt.isEmpty() || courseOpt.isEmpty()) {
            throw new RuntimeException("User or Course not found");
        }

        User user = userOpt.get();
        Course course = courseOpt.get();

        // Check if the user is already enrolled
        if (enrollmentRepository.existsByUserAndCourse(user, course)) {
            throw new RuntimeException("You have already enrolled in this course");
        }

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
}
