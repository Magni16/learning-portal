package com.onlinelearning.online_learning_platform;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// Add this to your main class or a controller
@RestController
public class TestController {
	@GetMapping("/test")
	public String test() {
		return "Server is running!";
	}
}
