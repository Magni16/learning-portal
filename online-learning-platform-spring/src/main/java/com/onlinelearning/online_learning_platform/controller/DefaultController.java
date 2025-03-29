package com.onlinelearning.online_learning_platform.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DefaultController {

    @GetMapping("/")
    public String index() {
        return "Backend for Online Learning Platform. Use the /api/* endpoints.";
    }
}
