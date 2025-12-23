using BlogPostApi.DTOs;
using BlogPostApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogPostApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogPostsController : ControllerBase
    {
        private readonly IBlogPostService _blogPostService;
        private readonly ILogger<BlogPostsController> _logger;

        public BlogPostsController(IBlogPostService blogPostService, ILogger<BlogPostsController> logger)
        {
            _blogPostService = blogPostService;
            _logger = logger;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        // Anyone can view posts (public feed)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPostResponseDto>>> GetAllPosts()
        {
            try
            {
                int? currentUserId = User.Identity?.IsAuthenticated == true ? GetUserId() : null;
                var posts = await _blogPostService.GetAllPostsAsync(currentUserId);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all blog posts");
                return StatusCode(500, "An error occurred while retrieving blog posts");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<BlogPostResponseDto>>> GetUserPosts(int userId)
        {
            try
            {
                int? currentUserId = User.Identity?.IsAuthenticated == true ? GetUserId() : null;
                var posts = await _blogPostService.GetUserPostsAsync(userId, currentUserId);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving posts for user with ID: {UserId}", userId);
                return StatusCode(500, "An error occurred while retrieving the user's posts");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPostResponseDto>> GetPost(int id)
        {
            try
            {
                int? currentUserId = User.Identity?.IsAuthenticated == true ? GetUserId() : null;
                var post = await _blogPostService.GetPostByIdAsync(id, currentUserId);

                if (post == null)
                    return NotFound($"Blog post with ID {id} not found");

                return Ok(post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving blog post with ID: {PostId}", id);
                return StatusCode(500, "An error occurred while retrieving the blog post");
            }
        }

        // Must be logged in to create
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BlogPostResponseDto>> CreatePost([FromBody] CreateBlogPostDto dto)
        {
            try
            {
                var userId = GetUserId();
                var post = await _blogPostService.CreatePostAsync(dto, userId);

                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog post");
                return StatusCode(500, "An error occurred while creating the blog post");
            }
        }

        // Must be logged in to update (service enforces ownership)
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<BlogPostResponseDto>> UpdatePost(int id, [FromBody] UpdateBlogPostDto dto)
        {
            try
            {
                var userId = GetUserId();
                var post = await _blogPostService.UpdatePostAsync(id, dto, userId);

                if (post == null)
                    return NotFound($"Blog post with ID {id} not found");

                return Ok(post);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating blog post with ID: {PostId}", id);
                return StatusCode(500, "An error occurred while updating the blog post");
            }
        }

        // Must be logged in to delete (service enforces ownership)
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePost(int id)
        {
            try
            {
                var userId = GetUserId();
                var result = await _blogPostService.DeletePostAsync(id, userId);

                if (!result)
                    return NotFound($"Blog post with ID {id} not found");

                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting blog post with ID: {PostId}", id);
                return StatusCode(500, "An error occurred while deleting the blog post");
            }
        }
    }
}
