package com.MyProject.MavHelp.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {

    @Id
    private String studentId;

    private boolean showPostHistory;
    private boolean allowEmailNotifications;
    private boolean allowReplies;
    private boolean anonymousMode;


    @OneToOne
    @MapsId
    @JoinColumn(name = "student_id")
    private Student student;
}
