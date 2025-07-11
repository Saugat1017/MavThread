package com.MyProject.MavHelp.dto;

import lombok.Data;

@Data
public class PostRequest {
    private String content;
    private String imageUrl; // optional
}
