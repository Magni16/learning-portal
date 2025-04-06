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

    // The file name as originally uploaded
    private String fileName;

    // The file path where it is stored on disk
    private String filePath;

    // The MIME type (e.g., "application/pdf", "image/jpeg")
    private String fileType;

    // When the file was uploaded
    private LocalDateTime uploadTime;

    // Many assignments are associated with one course.
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // The user who uploaded the file (could be instructor or student)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User uploader;
}
