package com.onlinelearning.online_learning_platform.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data

public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String videoLink; // YouTube/Vimeo URL

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
