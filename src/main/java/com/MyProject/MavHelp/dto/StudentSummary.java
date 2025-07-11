package com.MyProject.MavHelp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentSummary {
    private String name;
    private int points;
}
