package com.MyProject.MavHelp.Controller;

import com.MyProject.MavHelp.Entity.Post;
import com.MyProject.MavHelp.Service.CloudinaryService;
import com.MyProject.MavHelp.Service.PostService;
import com.MyProject.MavHelp.dto.PostRequest;
import com.MyProject.MavHelp.dto.PostResponse;
import com.MyProject.MavHelp.dto.ReplyRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {


    private final PostService postService;
    private final CloudinaryService cloudinaryService;

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
    @GetMapping("/global")
    public ResponseEntity<List<PostResponse>> getGlobalPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getAllPostsGlobal(page, size));
    }
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadMedia(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadFile(file, "mavhelp-posts");
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload file"));
        }
    }











}
