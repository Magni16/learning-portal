package com.onlinelearning.online_learning_platform.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
