package com.MyProject.MavHelp.dto;

import lombok.Data;

@Data
public class VoteRequest {
    private String type; // Expected: "upvote", "downvote", "appreciation"
}