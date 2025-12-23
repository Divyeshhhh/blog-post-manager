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

        public async Task<IEnumerable<BlogPostResponseDto>> GetAllPostsAsync(int? currentUserId = null)
        {
            var posts = await _context.BlogPosts
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return posts.Select(p => MapToDto(p, currentUserId));
        }

        public async Task<IEnumerable<BlogPostResponseDto>> GetUserPostsAsync(int userId, int? currentUserId = null)
        {
            var posts = await _context.BlogPosts
                .Include(p => p.User)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return posts.Select(p => MapToDto(p, currentUserId));
        }

        public async Task<BlogPostResponseDto?> GetPostByIdAsync(int id, int? currentUserId = null)
        {
            var post = await _context.BlogPosts
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            return post == null ? null : MapToDto(post, currentUserId);
        }

        public async Task<BlogPostResponseDto> CreatePostAsync(CreateBlogPostDto dto, int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");

            var post = new BlogPost
            {
                Title = dto.Title,
                Content = dto.Content,
                Author = user.Username,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Reload with user data
            await _context.Entry(post).Reference(p => p.User).LoadAsync();

            _logger.LogInformation("Created blog post with ID: {PostId} by user: {UserId}", post.Id, userId);
            return MapToDto(post, userId);
        }

        public async Task<BlogPostResponseDto?> UpdatePostAsync(int id, UpdateBlogPostDto dto, int userId)
        {
            var post = await _context.BlogPosts
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return null;
            if (post.UserId != userId) throw new UnauthorizedAccessException("You can only edit your own posts");

            post.Title = dto.Title;
            post.Content = dto.Content;
            post.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated blog post with ID: {PostId}", post.Id);
            return MapToDto(post, userId);
        }

        public async Task<bool> DeletePostAsync(int id, int userId)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return false;
            if (post.UserId != userId) throw new UnauthorizedAccessException("You can only delete your own posts");

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted blog post with ID: {PostId}", id);
            return true;
        }

        // Flagging removed — methods intentionally omitted

        private BlogPostResponseDto MapToDto(BlogPost post, int? currentUserId = null)
        {
            return new BlogPostResponseDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                Author = post.Author,
                UserId = post.UserId,
                FlagCount = post.FlagCount,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                IsOwner = currentUserId.HasValue && post.UserId == currentUserId.Value,
                User = new UserDto
                {
                    Id = post.User.Id,
                    Username = post.User.Username,
                    Email = post.User.Email,
                    FullName = post.User.FullName,
                    Bio = post.User.Bio,
                    ProfileImageUrl = post.User.ProfileImageUrl,
                    CreatedAt = post.User.CreatedAt
                }
            };
        }
    }
}