package com.MyProject.MavHelp.dto;

import lombok.Data;

@Data
public class UserSettingsRequest {
    private boolean showPostHistory;
    private boolean allowEmailNotifications;
    private boolean allowReplies;
    private boolean anonymousMode;
}
