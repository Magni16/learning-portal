// /src/main/java/com/onlinelearning/online_learning_platform/entity/Assignment.java
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

    // Original file name
    private String fileName;

    // File storage path on disk
    private String filePath;

    // MIME type of the file (e.g., "application/pdf", "image/jpeg")
    private String fileType;

    // When the file was uploaded
    private LocalDateTime uploadTime;

    // Many assignments are associated with one course.
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // The user who uploaded the file (could be instructor or student)
    // Then rename the join column
    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;
}
