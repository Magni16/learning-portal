package com.onlinelearning.online_learning_platform.repository;

import com.onlinelearning.online_learning_platform.entity.Submission;
import com.onlinelearning.online_learning_platform.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByAssignment(Assignment assignment);
    List<Submission> findByAssignmentAndStudent_Id(Assignment assignment, Long studentId);
}
