package com.onlinelearning.online_learning_platform.service;

import com.onlinelearning.online_learning_platform.entity.Course;
import com.onlinelearning.online_learning_platform.entity.Milestone;
import com.onlinelearning.online_learning_platform.repository.CourseRepository;
import com.onlinelearning.online_learning_platform.repository.MilestoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MilestoneService {
    private final MilestoneRepository milestoneRepository;
    private final CourseRepository courseRepository;

    public List<Milestone> getMilestonesByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow();
        return milestoneRepository.findByCourse(course);
    }

    public Milestone addMilestone(Long courseId, Milestone milestone) {
        Course course = courseRepository.findById(courseId).orElseThrow();
        milestone.setCourse(course);
        return milestoneRepository.save(milestone);
    }
}
