package com.MyProject.MavHelp.Service;

import com.MyProject.MavHelp.Entity.Student;
import com.MyProject.MavHelp.Repository.StudentRepository;
import com.MyProject.MavHelp.dto.RankResponse;
import com.MyProject.MavHelp.dto.StudentSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;

    public List<StudentSummary> getTop3InGroup() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return studentRepository.findByGroupCode(student.getGroupCode()).stream()
                .sorted(Comparator.comparingInt(Student::getPoints).reversed())
                .limit(3)
                .map(s -> StudentSummary.builder()
                        .name(s.getName())
                        .points(s.getPoints())
                        .build())
                .toList();
    }

    public RankResponse getMyRank() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Student> groupStudents = studentRepository.findByGroupCode(student.getGroupCode());
        groupStudents.sort(Comparator.comparingInt(Student::getPoints).reversed());

        int rank = -1;
        for (int i = 0; i < groupStudents.size(); i++) {
            if (groupStudents.get(i).getId().equals(student.getId())) {
                rank = i + 1;
                break;
            }
        }

        return RankResponse.builder()
                .name(student.getName())
                .rank(rank)
                .totalStudents(groupStudents.size())
                .build();
    }
    private Student getCurrentStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public List<StudentSummary> getWeeklyTopInGroup() {
        Student student = getCurrentStudent();
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);

        return studentRepository.findTopInGroupThisWeek(student.getGroupCode(), oneWeekAgo).stream()
                .limit(3)
                .map(s -> StudentSummary.builder()
                        .name(s.getName())
                        .points(s.getPoints())
                        .build())
                .toList();
    }

    public List<StudentSummary> getAllTimeTopScorers() {
        return studentRepository.findTopAllTime(org.springframework.data.domain.PageRequest.of(0, 3)).stream()
                .map(s -> StudentSummary.builder()
                        .name(s.getName())
                        .points(s.getPoints())
                        .build())
                .toList();
    }



}
