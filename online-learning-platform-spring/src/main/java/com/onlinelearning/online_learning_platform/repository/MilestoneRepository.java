package com.onlinelearning.online_learning_platform.repository;
import com.onlinelearning.online_learning_platform.entity.Course;
import com.onlinelearning.online_learning_platform.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByCourse(Course course);
}
