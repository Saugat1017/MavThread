package com.MyProject.MavHelp.Repository;

import com.MyProject.MavHelp.Entity.Post;
import com.MyProject.MavHelp.Entity.Student;
import com.MyProject.MavHelp.Entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByStudentAndPost(Student student, Post post);
}
