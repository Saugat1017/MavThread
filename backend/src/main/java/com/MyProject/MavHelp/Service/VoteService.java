package com.MyProject.MavHelp.Service;

import com.MyProject.MavHelp.Entity.Post;
import com.MyProject.MavHelp.Entity.Student;
import com.MyProject.MavHelp.Entity.Vote;
import com.MyProject.MavHelp.Repository.PostRepository;
import com.MyProject.MavHelp.Repository.StudentRepository;
import com.MyProject.MavHelp.Repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final PostRepository postRepository;
    private final StudentRepository studentRepository;
    private final VoteRepository voteRepository;

    public void castVote(Long postId, String type) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Student voter = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Vote> existingVoteOpt = voteRepository.findByStudentAndPost(voter, post);

        if (existingVoteOpt.isPresent()) {
            throw new RuntimeException("You have already voted on this post.");
        }

        voteRepository.save(Vote.builder()
                .student(voter)
                .post(post)
                .type(type.toLowerCase())
                .build());

        switch (type.toLowerCase()) {
            case "upvote" -> post.setUpvotes(post.getUpvotes() + 1);
            case "downvote" -> post.setDownvotes(post.getDownvotes() + 1);
            case "appreciation" -> post.setAppreciations(post.getAppreciations() + 1);
            default -> throw new IllegalArgumentException("Invalid vote type");
        }

        postRepository.save(post);

        if (!voter.getId().equals(post.getStudent().getId())) {
            Student postAuthor = post.getStudent();
            int points = switch (type.toLowerCase()) {
                case "upvote" -> 2;
                case "appreciation" -> 3;
                case "downvote" -> -1;
                default -> 0;
            };
            postAuthor.setPoints(postAuthor.getPoints() + points);
            studentRepository.save(postAuthor);
        }
    }
    public void undoVote(Long postId, String type) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        switch (type.toLowerCase()) {
            case "upvote" -> post.setUpvotes(Math.max(0, post.getUpvotes() - 1));
            case "downvote" -> post.setDownvotes(Math.max(0, post.getDownvotes() - 1));
            case "appreciation" -> post.setAppreciations(Math.max(0, post.getAppreciations() - 1));
            default -> throw new IllegalArgumentException("Invalid vote type");
        }

        postRepository.save(post);
    }
}
