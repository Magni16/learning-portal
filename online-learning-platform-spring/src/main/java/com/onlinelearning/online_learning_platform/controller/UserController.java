package com.onlinelearning.online_learning_platform.controller;

import com.onlinelearning.online_learning_platform.dto.LoginRequest;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Default mapping for /api/users when no email is provided.
    @GetMapping
    public ResponseEntity<?> getUsersDefault() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Email is required. Please use /api/users/{email} to fetch user details.");
    }

    // Email login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // Endpoint to update the user's password (already working)
    @PutMapping("/{userId}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found for id: " + userId);
        }
        User user = userOpt.get();

        // Debug logging: Print stored and provided passwords (remove in production)
        System.out.println("Stored Password: " + user.getPassword());
        System.out.println("Provided Current Password: " + currentPassword);

        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect.");
        }

        user.setPassword(newPassword);
        userService.updateUser(user);
        return ResponseEntity.ok("Password updated successfully.");
    }

    // New endpoint to update the user's preferred language
    @PutMapping("/{userId}/language")
    public ResponseEntity<?> updateLanguage(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        String language = payload.get("language");

        Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found for id: " + userId);
        }
        User user = userOpt.get();
        user.setPreferredLanguage(language);
        userService.updateUser(user);
        return ResponseEntity.ok("Language updated successfully.");
    }

    // New endpoint for login via epunjabid and password
    @PostMapping("/login/epunjab")
    public ResponseEntity<?> loginEpunjab(@RequestBody Map<String, String> payload) {
        String epunjabIdStr = payload.get("epunjabid");
        String password = payload.get("password");
        if (epunjabIdStr == null || password == null) {
            return ResponseEntity.badRequest().body("Missing epunjabid or password");
        }
        try {
            Long epunjabid = Long.parseLong(epunjabIdStr);
            Optional<User> userOpt = userService.authenticateEpunjab(epunjabid, password);
            if (userOpt.isPresent()) {
                return ResponseEntity.ok(userOpt.get());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid epunjab credentials");
            }
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().body("epunjabid must be a valid number");
        }
    }
}
