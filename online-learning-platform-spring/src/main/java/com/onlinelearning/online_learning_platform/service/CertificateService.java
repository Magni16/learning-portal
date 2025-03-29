package com.onlinelearning.online_learning_platform.service;

import com.onlinelearning.online_learning_platform.dto.CertificateDTO;
import com.onlinelearning.online_learning_platform.entity.Certificate;
import com.onlinelearning.online_learning_platform.entity.User;
import com.onlinelearning.online_learning_platform.repository.CertificateRepository;
import com.onlinelearning.online_learning_platform.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CertificateService {
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;

    // Add Certificate
    public Certificate createCertificate(CertificateDTO certificateDTO) {
        // Find the target user
        User targetUser = userRepository.findByEmail(certificateDTO.getUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + certificateDTO.getUserEmail()));

        Certificate certificate = new Certificate();
        certificate.setCertificateId(certificateDTO.getCertificateId()); // Assign certificateId
        certificate.setName(certificateDTO.getName());
        certificate.setCertificateUrl(certificateDTO.getCertificateUrl());
        certificate.setUser(targetUser);

        return certificateRepository.save(certificate);
    }

    public Certificate addCertificate(String certificateName, String certificateUrl, String userEmail) {
        // ✅ Ensure we fetch the User entity before saving
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        Certificate certificate = new Certificate();
        //certificate.setCertificateId(/* assign from input, e.g., provided as parameter */);
        certificate.setName(certificateName);
        certificate.setCertificateUrl(certificateUrl);
        certificate.setUser(user); // ✅ Assign User object
        certificate.setUserEmail(userEmail); // ✅ Also store userEmail separately

        return certificateRepository.save(certificate);
    }

    public List<Certificate> getCertificatesByUserEmail(String userEmail) {
        return certificateRepository.findByUserEmail(userEmail);
    }

    // Get Certificates for a User
    public List<Certificate> getUserCertificates(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return certificateRepository.findByUser(user);
    }

    // Delete Certificate based on userEmail and certificateId
    @Transactional // ✅ Ensures the delete operation runs inside a transaction
    public void deleteCertificate(Long certificateId, String userEmail) {
        Optional<Certificate> certificateOpt = certificateRepository.findByCertificateIdAndUserEmail(certificateId, userEmail);

        if (certificateOpt.isPresent()) {
            certificateRepository.delete(certificateOpt.get()); // ✅ Correct delete operation
        } else {
            throw new RuntimeException("Certificate not found for user: " + userEmail);
        }
    }
}
