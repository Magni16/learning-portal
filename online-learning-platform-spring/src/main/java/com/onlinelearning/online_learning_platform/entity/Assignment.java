package com.onlinelearning.online_learning_platform.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // File details for the assignment (instructions / assignment file)
    private String fileName;
    private String filePath;   // Stores the relative path e.g., "uploads/assignments/..."
    private String fileType;
    private LocalDateTime uploadTime;

    // The course to which this assignment belongs.
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // The instructor who posted this assignment.
    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;
}
