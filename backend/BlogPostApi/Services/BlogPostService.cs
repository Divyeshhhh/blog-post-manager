using BlogPostApi.Data;
using BlogPostApi.DTOs;
using BlogPostApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogPostApi.Services
{
    public class BlogPostService : IBlogPostService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BlogPostService> _logger;

        public BlogPostService(ApplicationDbContext context, ILogger<BlogPostService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<BlogPostResponseDto>> GetAllPostsAsync()
        {
            var posts = await _context.BlogPosts
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return posts.Select(MapToDto);
        }

        public async Task<BlogPostResponseDto?> GetPostByIdAsync(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            return post == null ? null : MapToDto(post);
        }

        public async Task<BlogPostResponseDto> CreatePostAsync(CreateBlogPostDto dto)
        {
            var post = new BlogPost
            {
                Title = dto.Title,
                Content = dto.Content,
                Author = dto.Author,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created blog post with ID: {PostId}", post.Id);
            return MapToDto(post);
        }

        public async Task<BlogPostResponseDto?> UpdatePostAsync(int id, UpdateBlogPostDto dto)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return null;

            post.Title = dto.Title;
            post.Content = dto.Content;
            post.Author = dto.Author;
            post.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated blog post with ID: {PostId}", post.Id);
            return MapToDto(post);
        }

        public async Task<bool> DeletePostAsync(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return false;

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted blog post with ID: {PostId}", id);
            return true;
        }

        private static BlogPostResponseDto MapToDto(BlogPost post)
        {
            return new BlogPostResponseDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                Author = post.Author,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt
            };
        }
    }
}