package com.MyProject.MavHelp.Controller;

import com.MyProject.MavHelp.Service.AuthService;
import com.MyProject.MavHelp.dto.AuthResponse;
import com.MyProject.MavHelp.dto.LoginRequest;
import com.MyProject.MavHelp.dto.ResetPasswordRequest;
import com.MyProject.MavHelp.dto.SignUpRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private void setAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1 hour
        response.addCookie(cookie);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignUpRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.signup(request);
        setAuthCookie(response, authResponse.getToken());
        return ResponseEntity.ok("Signup successful");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        setAuthCookie(response, authResponse.getToken());
        return ResponseEntity.ok("Login successful");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        authService.sendResetLink(body.get("email"));
        return ResponseEntity.ok("Password reset link sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request.getToken(), request.getNewPassword()));
    }
}
