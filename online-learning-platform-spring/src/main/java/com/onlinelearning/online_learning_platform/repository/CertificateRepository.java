package com.onlinelearning.online_learning_platform.repository;

import com.onlinelearning.online_learning_platform.entity.Certificate;
import com.onlinelearning.online_learning_platform.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByUser(User user);
    List<Certificate> findByUserEmail(String userEmail);
    Optional<Certificate> findByCertificateIdAndUserEmail(Long certificateId, String userEmail);

    @Modifying
    @Transactional
    void deleteByUserEmailAndCertificateId(String userEmail, Long certificateId);
}

