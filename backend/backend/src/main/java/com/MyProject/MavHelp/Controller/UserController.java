package com.MyProject.MavHelp.Controller;

import com.MyProject.MavHelp.Service.UserService;
import com.MyProject.MavHelp.dto.UpdateUserRequest;
import com.MyProject.MavHelp.dto.UserProfileResponse;
import com.MyProject.MavHelp.dto.UserSettingsRequest;
import com.MyProject.MavHelp.dto.UserSettingsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test endpoint works!");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(request));
    }
    @PutMapping("/settings")
    public ResponseEntity<String> updateSettings(@RequestBody UserSettingsRequest request) {
        return ResponseEntity.ok(userService.updateSettings(request));
    }

    @GetMapping("/settings")
    public ResponseEntity<UserSettingsResponse> getSettings() {
        return ResponseEntity.ok(userService.getSettings());
    }
}

