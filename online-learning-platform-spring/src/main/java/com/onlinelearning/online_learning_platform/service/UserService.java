package com.onlinelearning.online_learning_platform.service;

import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // New method to get a user by id
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    // New method to update a user
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            System.out.println("Found user: " + userOpt.get().getEmail());
            System.out.println("Stored password: " + userOpt.get().getPassword());
            System.out.println("Provided password: " + password);
            if (userOpt.get().getPassword().equals(password)) {
                return userOpt;
            }
        }
        return Optional.empty();
    }
}
