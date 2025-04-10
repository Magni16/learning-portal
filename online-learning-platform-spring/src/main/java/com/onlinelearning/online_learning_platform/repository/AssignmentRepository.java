package com.onlinelearning.online_learning_platform.repository;

import com.onlinelearning.online_learning_platform.entity.Assignment;
import com.onlinelearning.online_learning_platform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    // For instructor: assignments they uploaded
    List<Assignment> findByInstructor_Id(Long instructorId);

    // For getting assignments belonging to a course. (This can be used by instructors.)
    List<Assignment> findByCourse(Course course);
}
