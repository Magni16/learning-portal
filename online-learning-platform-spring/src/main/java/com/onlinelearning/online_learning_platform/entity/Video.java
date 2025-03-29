package com.onlinelearning.online_learning_platform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long videoId;  // Primary key

    private String videoName; // Name of the video
    private String videoUrl;  // URL of the video (e.g., YouTube link)

    // Many videos are associated with one course.
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}

