package com.onlinelearning.online_learning_platform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate certificateId
    private Long certificateId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String certificateUrl;

    @Column(nullable = false)
    private String userEmail; // Ensure this is correctly stored

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false) // Referencing BIGINT user ID
    private User user;

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getCertificateName() {
        return name;
    }

    public void setCertificateName(String name) {
        this.name = name;
    }
}
