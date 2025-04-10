package com.onlinelearning.online_learning_platform.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String filePath;  // Stores the relative path e.g., "uploads/submissions/..."
    private String fileType;
    private LocalDateTime uploadTime;

    // The assignment for which this submission is made.
    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    // The student who submitted the assignment.
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
}
