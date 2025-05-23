package com.onlinelearning.online_learning_platform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map /uploads/** to the external folder location.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/C:/Users/Kani/online-learning-platform/uploads/");
    }
}
