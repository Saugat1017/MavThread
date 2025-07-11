package com.MyProject.MavHelp.Repository;

import com.MyProject.MavHelp.Entity.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByStudentId(String studentId);
    @Query("""
        SELECT p FROM Post p 
        ORDER BY (p.upvotes * 2 + p.appreciations * 3 - p.downvotes) DESC
    """)
    List<Post> findTop3ByScore(Pageable pageable);

    @Query("""
        SELECT p FROM Post p 
        WHERE p.student.groupCode = :groupCode AND p.parent IS NULL
        ORDER BY (p.upvotes * 2 + p.appreciations * 3 - p.downvotes) DESC
    """)
    List<Post> findTop3ByGroupCode(String groupCode, Pageable pageable);
    List<Post> findByStudent_GroupCodeOrderByCreatedAtDesc(String groupCode);
    @Query("""
    SELECT p FROM Post p
    WHERE p.student.id = :studentId AND p.parent IS NULL
    ORDER BY p.createdAt DESC
""")
    List<Post> findRecentTopLevelPostsByStudent(String studentId, Pageable pageable);

    @Query("""
    SELECT p FROM Post p
    WHERE p.student.id = :studentId AND p.parent IS NULL
    ORDER BY p.createdAt DESC
""")
    List<Post> findAllTopLevelPostsByStudentSorted(String studentId);


}
