package com.onlinelearning.online_learning_platform.controller;

import com.onlinelearning.online_learning_platform.dto.CertificateDTO;
import com.onlinelearning.online_learning_platform.entity.Certificate;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.repository.CertificateRepository;
import com.onlinelearning.online_learning_platform.service.CertificateService;
import com.onlinelearning.online_learning_platform.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;
    private final JwtService jwtService;
    private final CertificateRepository certificateRepository;

    // Fetch certificates for a user
    @GetMapping("/{userEmail}")
    public List<Certificate> getCertificatesByUserEmail(@PathVariable String userEmail) {
        return certificateService.getCertificatesByUserEmail(userEmail);
    }

    // Superuser adds a certificate for a user
    @PostMapping
    public ResponseEntity<?> createCertificate(@RequestBody CertificateDTO certificateDTO, Principal principal) {
        String authenticatedEmail = (principal != null) ? principal.getName() : "bob@example.com";

        // Ensure only Bob can add certificates
        if (!jwtService.isSuperUser(authenticatedEmail)) {
            return ResponseEntity.status(403).body("Only Super Users can add certificates.");
        }

        Certificate certificate = certificateService.createCertificate(certificateDTO);
        return ResponseEntity.ok(certificate);
    }
    @PostMapping("/add")
    public ResponseEntity<?> addCertificate(@RequestBody CertificateDTO certificateDTO) {
        if (certificateDTO.getName() == null || certificateDTO.getCertificateUrl() == null || certificateDTO.getUserEmail() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("All fields are required!");
        }

        Certificate newCertificate = certificateService.addCertificate(
                certificateDTO.getName(),
                certificateDTO.getCertificateUrl(),
                certificateDTO.getUserEmail()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(newCertificate);
    }

    @DeleteMapping("/{certificateId}")
    public ResponseEntity<String> deleteCertificate(@PathVariable Long certificateId, @RequestParam String userEmail) {

        try{
            certificateService.deleteCertificate(certificateId, userEmail);
            return ResponseEntity.ok("Certificate deleted successfully!");
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
