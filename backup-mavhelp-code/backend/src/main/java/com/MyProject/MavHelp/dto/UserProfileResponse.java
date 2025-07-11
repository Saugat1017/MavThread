package com.MyProject.MavHelp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserProfileResponse {
    private String name;
    private String email;
    private String major;
    private String year;
    private String groupCode;
    private int points;
}
