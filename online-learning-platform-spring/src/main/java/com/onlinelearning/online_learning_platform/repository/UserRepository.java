package com.onlinelearning.online_learning_platform.repository;

import com.onlinelearning.online_learning_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}