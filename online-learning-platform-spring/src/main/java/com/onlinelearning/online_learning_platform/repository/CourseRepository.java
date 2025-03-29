package com.onlinelearning.online_learning_platform.repository;

import com.onlinelearning.online_learning_platform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor(String instructor);
}
