package com.MyProject.MavHelp.Controller;

import com.MyProject.MavHelp.Service.AuthService;
import com.MyProject.MavHelp.Security.JwtTokenProvider;
import com.MyProject.MavHelp.dto.LoginRequest;
import com.MyProject.MavHelp.dto.ResetPasswordRequest;
import com.MyProject.MavHelp.dto.SignUpRequest;
import com.MyProject.MavHelp.dto.AuthResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    private void setHttpOnlyCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false) // Set to true in production (https)
                .path("/")
                .maxAge(60 * 60) // 1 hour
                .sameSite("Lax") // or "Strict" or "None" depending on frontend setup
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignUpRequest request, HttpServletResponse response) {
        authService.signup(request);
        String token = jwtTokenProvider.generateToken(request.getEmail());
        setHttpOnlyCookie(response, token);
        return ResponseEntity.ok(new AuthResponse("Signup successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        authService.login(request);
        String token = jwtTokenProvider.generateToken(request.getEmail());
        setHttpOnlyCookie(response, token);
        return ResponseEntity.ok(new AuthResponse("Login successful"));
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
