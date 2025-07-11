package com.MyProject.MavHelp.Service;

import com.MyProject.MavHelp.Entity.Student;
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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(SignUpRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered.");
        }

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
        return new AuthResponse(token, "Signup successful");
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(request.getEmail());
        return new AuthResponse(token, "Login successful");
    }
}