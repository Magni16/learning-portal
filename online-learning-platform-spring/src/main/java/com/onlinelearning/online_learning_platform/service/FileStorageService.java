import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads/assignments";

    public void saveFile(MultipartFile file) throws IOException {
        // Create the directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Resolve the file path within the upload directory
        Path filePath = Paths.get(uploadDir, file.getOriginalFilename());

        // Save the file to the target location
        file.transferTo(filePath.toFile());
    }
}
