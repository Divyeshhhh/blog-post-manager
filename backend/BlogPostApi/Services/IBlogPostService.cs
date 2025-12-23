using BlogPostApi.DTOs;

namespace BlogPostApi.Services
{
    public interface IBlogPostService
    {
        Task<IEnumerable<BlogPostResponseDto>> GetAllPostsAsync(int? currentUserId = null);
        Task<IEnumerable<BlogPostResponseDto>> GetUserPostsAsync(int userId, int? currentUserId = null);
        Task<BlogPostResponseDto?> GetPostByIdAsync(int id, int? currentUserId = null);
        Task<BlogPostResponseDto> CreatePostAsync(CreateBlogPostDto dto, int userId);
        Task<BlogPostResponseDto?> UpdatePostAsync(int id, UpdateBlogPostDto dto, int userId);
        Task<bool> DeletePostAsync(int id, int userId);
    }
}