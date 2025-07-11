package com.MyProject.MavHelp.Service;

import com.MyProject.MavHelp.Entity.Student;
import com.MyProject.MavHelp.Entity.UserSettings;
import com.MyProject.MavHelp.Repository.StudentRepository;
import com.MyProject.MavHelp.dto.UpdateUserRequest;
import com.MyProject.MavHelp.dto.UserProfileResponse;
import com.MyProject.MavHelp.dto.UserSettingsRequest;
import com.MyProject.MavHelp.dto.UserSettingsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final StudentRepository studentRepository;

    public UserProfileResponse getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return UserProfileResponse.builder()
                .name(student.getName())
                .email(student.getEmail())
                .major(student.getMajor())
                .year(student.getYear())
                .groupCode(student.getGroupCode())
                .points(student.getPoints())
                .build();
    }

    public String updateUser(UpdateUserRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setName(request.getName());
        student.setMajor(request.getMajor());
        student.setYear(request.getYear());
        student.setGroupCode(request.getMajor() + "-" + request.getYear());
        studentRepository.save(student);
        return "Updated successfully";
    }


    public String updateSettings(UserSettingsRequest request) {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Student student = studentRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            UserSettings settings = Optional.ofNullable(student.getUserSettings())
                    .orElse(UserSettings.builder().student(student).build());

            settings.setAllowReplies(request.isAllowReplies());
            settings.setAllowEmailNotifications(request.isAllowEmailNotifications());
            settings.setAnonymousMode(request.isAnonymousMode());
            settings.setShowPostHistory(request.isShowPostHistory());

            student.setUserSettings(settings);

            studentRepository.save(student);
            return "Settings updated";
    }

    public UserSettingsResponse getSettings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        UserSettings s = Optional.ofNullable(student.getUserSettings())
                .orElse(UserSettings.builder().build());

        return UserSettingsResponse.builder()
                .allowReplies(s.isAllowReplies())
                .allowEmailNotifications(s.isAllowEmailNotifications())
                .anonymousMode(s.isAnonymousMode())
                .showPostHistory(s.isShowPostHistory())
                .build();
    }
}

