package com.MyProject.MavHelp.Controller;

import com.MyProject.MavHelp.Service.VoteService;
import com.MyProject.MavHelp.dto.VoteRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/{postId}/vote")
    public ResponseEntity<String> vote(@PathVariable Long postId, @RequestBody VoteRequest request) {
        voteService.castVote(postId, request.getType());
        return ResponseEntity.ok("Vote recorded");
    }

    @DeleteMapping("/{postId}/vote")
    public ResponseEntity<String> undoVote(@PathVariable Long postId, @RequestBody VoteRequest request) {
        voteService.undoVote(postId, request.getType());
        return ResponseEntity.ok("Vote removed");
    }
}
