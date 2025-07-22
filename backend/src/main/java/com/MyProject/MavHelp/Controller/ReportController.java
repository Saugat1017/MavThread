package com.MyProject.MavHelp.Controller;

import com.MyProject.MavHelp.Entity.Report;
import com.MyProject.MavHelp.Service.ReportService;
import com.MyProject.MavHelp.dto.ReportRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/{postId}")
    public ResponseEntity<String> reportPost(@PathVariable Long postId, @RequestBody ReportRequest request) {
        reportService.reportPost(postId, request.getReason());
        return ResponseEntity.ok("Post reported successfully");
    }
    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }
}
