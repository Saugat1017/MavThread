package com.MyProject.MavHelp.Service;

import com.MyProject.MavHelp.Entity.Post;
import com.MyProject.MavHelp.Entity.Student;
import com.MyProject.MavHelp.Repository.PostRepository;
import com.MyProject.MavHelp.Repository.StudentRepository;
import com.MyProject.MavHelp.dto.PostRequest;
import com.MyProject.MavHelp.dto.PostResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final StudentRepository studentRepository;

    public String createPost(PostRequest request) {
        Student student = getCurrentStudent();

        boolean isAnonymous = student.getUserSettings() != null && student.getUserSettings().isAnonymousMode();

        Post post = Post.builder()
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .videoUrl(request.getVideoUrl())
                .student(student)
                .anonymous(isAnonymous)
                .createdAt(LocalDateTime.now())
                .build();

        postRepository.save(post);

        // 🔥 Auto-delete older posts (beyond latest 10) but retain points
        cleanupOldPosts(student.getId());

        return "Post created successfully";
    }

    public String replyToPost(Long postId, String content) {
        Student replier = getCurrentStudent();
        Post parentPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean isAnonymous = replier.getUserSettings() != null && replier.getUserSettings().isAnonymousMode();

        Post reply = Post.builder()
                .content(content)
                .student(replier)
                .parent(parentPost)
                .anonymous(isAnonymous)
                .createdAt(LocalDateTime.now())
                .build();

        postRepository.save(reply);

        // +1 for replier
        replier.setPoints(replier.getPoints() + 1);

        // +1 for post author (if not self-reply)
        if (!replier.getId().equals(parentPost.getStudent().getId())) {
            Student postAuthor = parentPost.getStudent();
            postAuthor.setPoints(postAuthor.getPoints() + 1);
            studentRepository.save(postAuthor);
        }

        studentRepository.save(replier);
        return "Reply posted successfully";
    }

    public List<Post> getTop3Posts() {
        return postRepository.findTop3ByScore(PageRequest.of(0, 3));
    }

    public List<PostResponse> getGroupPosts() {
        Student student = getCurrentStudent();
        String groupCode = student.getGroupCode();

        List<Post> posts = postRepository.findByStudent_GroupCodeOrderByCreatedAtDesc(groupCode)
                .stream()
                .filter(post -> post.getParent() == null)
                .toList();

        return posts.stream()
                .map(post -> mapToResponse(post, student))
                .toList();
    }

    public String deletePost(Long postId) {
        Student requester = getCurrentStudent();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean isAdmin = requester.getRole() != null && requester.getRole().equalsIgnoreCase("ADMIN");
        boolean isOwner = requester.getId().equals(post.getStudent().getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Unauthorized to delete this post");
        }

        postRepository.delete(post);
        return "Post deleted successfully";
    }

    public List<PostResponse> getMyRecentPosts() {
        Student student = getCurrentStudent();

        List<Post> posts = postRepository
                .findRecentTopLevelPostsByStudent(student.getId(), PageRequest.of(0, 10));

        return posts.stream()
                .map(post -> mapToResponse(post, student))
                .toList();
    }

    private PostResponse mapToResponse(Post post, Student currentStudent) {
        boolean isTopRanked = postRepository
                .findTop3ByGroupCode(post.getStudent().getGroupCode(), PageRequest.of(0, 3))
                .contains(post);

        String author = post.isAnonymous() && !isTopRanked
                ? "Anonymous"
                : post.getStudent().getName();

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .anonymous(post.isAnonymous())
                .authorName(author)
                .createdAt(post.getCreatedAt())
                .upvotes(post.getUpvotes())
                .downvotes(post.getDownvotes())
                .appreciations(post.getAppreciations())
                .totalPoints(post.getTotalPoints())
                .replies(post.getReplies().stream()
                        .map(reply -> mapToResponse(reply, currentStudent))
                        .toList())
                .build();
    }

    private Student getCurrentStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    private void cleanupOldPosts(String studentId) {
        List<Post> posts = postRepository.findAllTopLevelPostsByStudentSorted(studentId);
        if (posts.size() > 10) {
            List<Post> toDelete = posts.subList(10, posts.size());
            postRepository.deleteAll(toDelete);
        }
    }


    private PostResponse buildThreadPostResponse(Post post) {
        boolean isTopRanked = postRepository
                .findTop3ByGroupCode(post.getStudent().getGroupCode(), PageRequest.of(0, 3))
                .contains(post);

        String author = post.isAnonymous() && !isTopRanked
                ? "Anonymous"
                : post.getStudent().getName();

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .anonymous(post.isAnonymous())
                .authorName(author)
                .createdAt(post.getCreatedAt())
                .upvotes(post.getUpvotes())
                .downvotes(post.getDownvotes())
                .appreciations(post.getAppreciations())
                .totalPoints(post.getTotalPoints())
                .replies(post.getReplies().stream()
                        .sorted(Comparator.comparing(Post::getCreatedAt))
                        .map(this::buildThreadPostResponse)
                        .toList())
                .build();
    }
    public List<PostResponse> getPaginatedThreadFeed(int page, int size) {
        Student currentStudent = getCurrentStudent();
        String groupCode = currentStudent.getGroupCode();

        PageRequest pageRequest = PageRequest.of(page, size);

        List<Post> topLevelPosts = postRepository
                .findTopLevelPostsWithReplies(groupCode, pageRequest);

        return topLevelPosts.stream()
                .map(this::buildThreadPostResponse)
                .toList();
    }



}