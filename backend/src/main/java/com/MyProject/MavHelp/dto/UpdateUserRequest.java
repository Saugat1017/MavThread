package com.MyProject.MavHelp.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;
    private String major;
    private String year;
}
