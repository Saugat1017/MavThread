package com.MyProject.MavHelp.dto;

import lombok.Data;

@Data
public class SignUpRequest {
    private String name;
    private String email;
    private String password;
    private String major;
    private String year;
}
