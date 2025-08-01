package com.MyProject.MavHelp.Repository;

import com.MyProject.MavHelp.Entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<com.MyProject.MavHelp.Entity.PasswordResetToken> findByToken(String token);
}
