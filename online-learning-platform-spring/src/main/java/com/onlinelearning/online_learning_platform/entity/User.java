package com.onlinelearning.online_learning_platform.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // STUDENT, INSTRUCTOR, ADMIN



    // New field for preferred language; default is English ("en")
    @Column(nullable = false)
    private String preferredLanguage = "en";
}
