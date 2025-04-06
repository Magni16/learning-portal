// /src/main/java/com/onlinelearning/online_learning_platform/repository/AssignmentRepository.java
package com.onlinelearning.online_learning_platform.repository;

import com.onlinelearning.online_learning_platform.entity.Assignment;
import com.onlinelearning.online_learning_platform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.http.HttpStatus;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourse(Course course);
}
