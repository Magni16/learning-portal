package com.onlinelearning.online_learning_platform.repository;

import com.onlinelearning.online_learning_platform.entity.Video;
import com.onlinelearning.online_learning_platform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    // Find all videos associated with a specific course.
    List<Video> findByCourse(Course course);
}
