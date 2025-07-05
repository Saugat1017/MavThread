package com.MyProject.MavHelp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSettingsResponse {
    private boolean showPostHistory;
    private boolean allowEmailNotifications;
    private boolean allowReplies;
    private boolean anonymousMode;
}

