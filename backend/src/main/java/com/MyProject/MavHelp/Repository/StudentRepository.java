package com.MyProject.MavHelp.Repository;

import com.MyProject.MavHelp.Entity.Student;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Student> findByGroupCode(String groupCode);
    @Query("""
    SELECT s FROM Student s
    WHERE s.groupCode = :groupCode AND s.pointsUpdatedAt >= :cutoff
    ORDER BY s.points DESC
""")
    List<Student> findTopInGroupThisWeek(String groupCode, LocalDateTime cutoff);

    @Query("""
    SELECT s FROM Student s
    ORDER BY s.points DESC
""")
    List<Student> findTopAllTime(Pageable pageable);


}
