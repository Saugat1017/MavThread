package com.MyProject.MavHelp.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String imageUrl;

    private boolean anonymous;

    private int upvotes = 0;
    private int appreciations = 0;
    private int downvotes = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Post parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Post> replies = new ArrayList<>();

    private LocalDateTime createdAt;

    public int getTotalPoints() {
        return upvotes * 2 + appreciations * 3 - downvotes;
    }

    public boolean isReply() {
        return parent != null;
    }
}
