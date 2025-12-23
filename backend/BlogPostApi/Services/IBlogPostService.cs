using BlogPostApi.DTOs;

namespace BlogPostApi.Services
{
    public interface IBlogPostService
    {
        Task<IEnumerable<BlogPostResponseDto>> GetAllPostsAsync();
        Task<BlogPostResponseDto?> GetPostByIdAsync(int id);
        Task<BlogPostResponseDto> CreatePostAsync(CreateBlogPostDto dto);
        Task<BlogPostResponseDto?> UpdatePostAsync(int id, UpdateBlogPostDto dto);
        Task<bool> DeletePostAsync(int id);
    }
}