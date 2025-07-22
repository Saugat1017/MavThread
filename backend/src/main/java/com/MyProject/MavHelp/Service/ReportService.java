package com.MyProject.MavHelp.Service;

import com.MyProject.MavHelp.Entity.Post;
import com.MyProject.MavHelp.Entity.Report;
import com.MyProject.MavHelp.Entity.Student;
import com.MyProject.MavHelp.Repository.PostRepository;
import com.MyProject.MavHelp.Repository.ReportRepository;
import com.MyProject.MavHelp.Repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostRepository postRepository;
    private final StudentRepository studentRepository;

    public void reportPost(Long postId, String reason) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Student reporter = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Report report = Report.builder()
                .reporter(reporter)
                .post(post)
                .reason(reason)
                .createdAt(LocalDateTime.now())
                .build();

        reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc();
    }
}
