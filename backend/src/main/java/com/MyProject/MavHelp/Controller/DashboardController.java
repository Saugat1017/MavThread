package com.MyProject.MavHelp.Controller;

import com.MyProject.MavHelp.Service.DashboardService;
import com.MyProject.MavHelp.dto.RankResponse;
import com.MyProject.MavHelp.dto.StudentSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/group-leaderboard")
    public ResponseEntity<List<StudentSummary>> getTop3InGroup() {
        return ResponseEntity.ok(dashboardService.getTop3InGroup());
    }

    @GetMapping("/my-rank")
    public ResponseEntity<RankResponse> getMyRank() {
        return ResponseEntity.ok(dashboardService.getMyRank());
    }
    @GetMapping("/leaderboard/weekly")
    public ResponseEntity<List<StudentSummary>> getWeeklyGroupLeaderboard() {
        return ResponseEntity.ok(dashboardService.getWeeklyTopInGroup());
    }

    @GetMapping("/leaderboard/all-time")
    public ResponseEntity<List<StudentSummary>> getAllTimeLeaderboard() {
        return ResponseEntity.ok(dashboardService.getAllTimeTopScorers());
    }

}
