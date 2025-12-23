using BlogPostApi.Data;
using BlogPostApi.DTOs;
using BlogPostApi.Models;
using BlogPostApi.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace BlogPostApi.Tests
{
    public class BlogPostServiceTests
    {
        private readonly Mock<ILogger<BlogPostService>> _loggerMock;
        private readonly ApplicationDbContext _context;
        private readonly BlogPostService _service;

        public BlogPostServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _loggerMock = new Mock<ILogger<BlogPostService>>();
            _service = new BlogPostService(_context, _loggerMock.Object);
        }

        [Fact]
        public async Task CreatePostAsync_ShouldCreatePost()
        {
            // Arrange
            var dto = new CreateBlogPostDto
            {
                Title = "Test Post",
                Content = "Test content for the blog post",
                Author = "Test Author"
            };

            // Act
            var result = await _service.CreatePostAsync(dto);

            // Assert
            result.Should().NotBeNull();
            result.Title.Should().Be(dto.Title);
            result.Content.Should().Be(dto.Content);
            result.Author.Should().Be(dto.Author);
            result.Id.Should().BeGreaterThan(0);
        }

        [Fact]
        public async Task GetAllPostsAsync_ShouldReturnAllPosts()
        {
            // Arrange
            _context.BlogPosts.AddRange(
                new BlogPost { Title = "Post 1", Content = "Content 1", Author = "Author 1", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new BlogPost { Title = "Post 2", Content = "Content 2", Author = "Author 2", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetAllPostsAsync();

            // Assert
            result.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetPostByIdAsync_ShouldReturnPost_WhenExists()
        {
            // Arrange
            var post = new BlogPost
            {
                Title = "Test Post",
                Content = "Test content",
                Author = "Test Author",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetPostByIdAsync(post.Id);

            // Assert
            result.Should().NotBeNull();
            result!.Title.Should().Be(post.Title);
        }

        [Fact]
        public async Task UpdatePostAsync_ShouldUpdatePost_WhenExists()
        {
            // Arrange
            var post = new BlogPost
            {
                Title = "Original Title",
                Content = "Original content",
                Author = "Original Author",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            var updateDto = new UpdateBlogPostDto
            {
                Title = "Updated Title",
                Content = "Updated content",
                Author = "Updated Author"
            };

            // Act
            var result = await _service.UpdatePostAsync(post.Id, updateDto);

            // Assert
            result.Should().NotBeNull();
            result!.Title.Should().Be(updateDto.Title);
            result.Content.Should().Be(updateDto.Content);
        }

        [Fact]
        public async Task DeletePostAsync_ShouldReturnTrue_WhenPostExists()
        {
            // Arrange
            var post = new BlogPost
            {
                Title = "Test Post",
                Content = "Test content",
                Author = "Test Author",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.DeletePostAsync(post.Id);

            // Assert
            result.Should().BeTrue();
            var deletedPost = await _context.BlogPosts.FindAsync(post.Id);
            deletedPost.Should().BeNull();
        }

        [Fact]
        public async Task DeletePostAsync_ShouldReturnFalse_WhenPostDoesNotExist()
        {
            // Act
            var result = await _service.DeletePostAsync(999);

            // Assert
            result.Should().BeFalse();
        }
    }
}