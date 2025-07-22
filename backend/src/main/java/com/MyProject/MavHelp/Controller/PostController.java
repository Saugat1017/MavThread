package com.MyProject.MavHelp.Controller;

import com.MyProject.MavHelp.Entity.Post;
import com.MyProject.MavHelp.Service.PostService;
import com.MyProject.MavHelp.dto.PostRequest;
import com.MyProject.MavHelp.dto.PostResponse;
import com.MyProject.MavHelp.dto.ReplyRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    @Autowired
    private final PostService postService;

    @PostMapping("/create")
    public ResponseEntity<String> createPost(@RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.createPost(request));
    }
    @PostMapping("/{postId}/reply")
    public ResponseEntity<String> replyToPost(@PathVariable Long postId, @RequestBody ReplyRequest request) {
        return ResponseEntity.ok(postService.replyToPost(postId, request.getContent()));
    }
    @GetMapping("/group")
    public ResponseEntity<List<PostResponse>> getGroupPosts() {
        return ResponseEntity.ok(postService.getGroupPosts());
    }
    @GetMapping("/leaderboard")
    public ResponseEntity<List<Post>> getTopPosts() {
        return ResponseEntity.ok(postService.getTop3Posts());
    }
    @DeleteMapping("/{postId}/delete")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.deletePost(postId));
    }
    @GetMapping("/my-history")
    public ResponseEntity<List<PostResponse>> getMyHistory() {
        return ResponseEntity.ok(postService.getMyRecentPosts());
    }
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getPaginatedThreadFeed(page, size));
    }








}
