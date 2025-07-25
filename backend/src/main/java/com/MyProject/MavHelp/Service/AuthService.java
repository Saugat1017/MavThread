package com.MyProject.MavHelp.Service;

import com.MyProject.MavHelp.Entity.PasswordResetToken;
import com.MyProject.MavHelp.Entity.Student;
import com.MyProject.MavHelp.Repository.PasswordResetTokenRepository;
import com.MyProject.MavHelp.Repository.StudentRepository;
import com.MyProject.MavHelp.Security.JwtTokenProvider;
import com.MyProject.MavHelp.dto.AuthResponse;
import com.MyProject.MavHelp.dto.LoginRequest;
import com.MyProject.MavHelp.dto.SignUpRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(SignUpRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered.");
        }

        validatePassword(request.getPassword());

        Student student = Student.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .year(request.getYear())
                .groupCode(request.getMajor() + "-" + request.getYear())
                .build();

        studentRepository.save(student);

        String token = jwtTokenProvider.generateToken(student.getEmail());
        return new AuthResponse("Signup successful");
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Student student = studentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtTokenProvider.generateToken(student.getEmail());
        return new AuthResponse("Login successful");
    }

    public void sendResetLink(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(1);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .student(student)
                .expiryDate(expiry)
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetUrl = "https://your-frontend.com/reset-password?token=" + token;
        System.out.println("RESET LINK: " + resetUrl);
    }

    public String resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        validatePassword(newPassword);

        Student student = resetToken.getStudent();
        student.setPassword(passwordEncoder.encode(newPassword));
        studentRepository.save(student);

        passwordResetTokenRepository.delete(resetToken);

        return "Password reset successfully!";
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        if (!password.matches(".*[a-zA-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least one letter");
        }
        if (!password.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Password must contain at least one digit");
        }
        if (!password.matches(".*[!@#$%^&*()_+=\\-{}\\[\\]:;\"'<>,.?/].*")) {
            throw new IllegalArgumentException("Password must contain at least one special character");
        }
    }
}
