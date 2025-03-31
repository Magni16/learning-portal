package com.onlinelearning.online_learning_platform.service;

import com.onlinelearning.online_learning_platform.entity.Course;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getCoursesForUser(User currentUser) {
        if (currentUser.getRole().equalsIgnoreCase("SUPERUSER")) {
            return getAllCourses();
        } else if (currentUser.getRole().equalsIgnoreCase("INSTRUCTOR")) {
            return courseRepository.findByUser(currentUser);
        } else {
            // For students, you may choose to return an empty list
            return List.of();
        }
    }

    // Create a new course – make sure the instructor (user) is set
    public Course createCourse(Course course) {
        if (course.getUser() == null) {
            throw new RuntimeException("Instructor (user) must be specified for the course.");
        }
        return courseRepository.save(course);
    }

    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
    }

    public List<Course> getCoursesByInstructor(String instructorEmail) {
        return courseRepository.findByInstructor(instructorEmail);
    }

}