package com.MyProject.MavHelp.Repository;

import com.MyProject.MavHelp.Entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSettingRepository extends JpaRepository<UserSettings, String> {
}
