package com.onlinelearning.online_learning_platform.dto;

import lombok.Data;

@Data
public class CertificateDTO {
    private Long certificateId;      // Unique certificate ID
    private String userEmail;        // Email of the target user
    private String name;             // Certificate Name
    private String certificateUrl;   // Certificate URL
}
