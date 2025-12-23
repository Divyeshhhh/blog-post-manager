using BlogPostApi.DTOs;
using BlogPostApi.Services;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPostResponseDto>>> GetAllPosts()
        {
            try
            {
                var posts = await _blogPostService.GetAllPostsAsync();
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all blog posts");
                return StatusCode(500, "An error occurred while retrieving blog posts");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPostResponseDto>> GetPost(int id)
        {
            try
            {
                var post = await _blogPostService.GetPostByIdAsync(id);
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

        [HttpPost]
        public async Task<ActionResult<BlogPostResponseDto>> CreatePost([FromBody] CreateBlogPostDto dto)
        {
            try
            {
                var post = await _blogPostService.CreatePostAsync(dto);
                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog post");
                return StatusCode(500, "An error occurred while creating the blog post");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BlogPostResponseDto>> UpdatePost(int id, [FromBody] UpdateBlogPostDto dto)
        {
            try
            {
                var post = await _blogPostService.UpdatePostAsync(id, dto);
                if (post == null)
                    return NotFound($"Blog post with ID {id} not found");

                return Ok(post);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating blog post with ID: {PostId}", id);
                return StatusCode(500, "An error occurred while updating the blog post");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePost(int id)
        {
            try
            {
                var result = await _blogPostService.DeletePostAsync(id);
                if (!result)
                    return NotFound($"Blog post with ID {id} not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting blog post with ID: {PostId}", id);
                return StatusCode(500, "An error occurred while deleting the blog post");
            }
        }
    }
}