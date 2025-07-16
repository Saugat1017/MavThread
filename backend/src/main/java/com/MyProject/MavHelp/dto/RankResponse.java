package com.MyProject.MavHelp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RankResponse {
    private String name;
    private int rank;
    private int totalStudents;
}
