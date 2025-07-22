package com.MyProject.MavHelp.dto;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String content;
    private String imageUrl;
    private String videoUrl;
    private boolean anonymous;
    private String authorName;
    private LocalDateTime createdAt;
    private int upvotes;
    private int downvotes;
    private int appreciations;
    private int totalPoints;
    private List<PostResponse> replies;
}
