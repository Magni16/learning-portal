package com.onlinelearning.online_learning_platform.repository;

import com.onlinelearning.online_learning_platform.entity.Enrollment;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUser(User user);

    // Check if an enrollment exists for a user and a course
    boolean existsByUserAndCourse(User user, Course course);

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    Optional<Enrollment> findByUserAndCourse(User user, Course course);
}
