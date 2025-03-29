package com.onlinelearning.online_learning_platform.config;

import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .cors(withDefaults())
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(authorize -> authorize
//                        .anyRequest().authenticated())
//                .httpBasic(withDefaults());  // Enable HTTP Basic authentication
//        return http.build();
//    }

// only for testing (not for production)
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
            .cors(withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers("/certificates/**").hasAnyRole("SUPERUSER") // Allow SUPERUSER to delete
                    .anyRequest().permitAll())  // Permit all requests for testing
            .formLogin(withDefaults());
    return http.build();
    }
}
