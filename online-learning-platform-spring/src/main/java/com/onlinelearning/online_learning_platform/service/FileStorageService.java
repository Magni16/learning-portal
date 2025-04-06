package com.onlinelearning.online_learning_platform.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    private static final String UPLOAD_DIR = "C:/Users/Kani/online-learning-platform/online-learning-platform-spring/src/main/resources/static/uploads/assignments";

    public void saveFile(MultipartFile file) throws IOException {
        // Create the directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            boolean wasSuccessful = uploadDir.mkdirs();
            if (!wasSuccessful) {
                throw new IOException("Failed to create directory: " + UPLOAD_DIR);
            }
        }

        // Resolve the file path within the upload directory using string constant UPLOAD_DIR
        Path filePath = Paths.get(UPLOAD_DIR, file.getOriginalFilename());

        // Save the file to the target location
        File uploadedFile = filePath.toFile();
        file.transferTo(uploadedFile);
    }
}
