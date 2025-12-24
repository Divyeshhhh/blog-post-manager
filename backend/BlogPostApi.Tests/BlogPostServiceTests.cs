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
        private readonly Models.User _user;
        private readonly int _userId;

        public BlogPostServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _loggerMock = new Mock<ILogger<BlogPostService>>();
            _service = new BlogPostService(_context, _loggerMock.Object);
            // Create a default user for tests
            _user = new Models.User
            {
                Username = "testuser",
                Email = "test@example.com",
                PasswordHash = "hash",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Users.Add(_user);
            _context.SaveChanges();
            _userId = _user.Id;
        }

        [Fact]
        public async Task CreatePostAsync_ShouldCreatePost()
        {
            // Arrange
            var dto = new CreateBlogPostDto
            {
                Title = "Test Post",
                Content = "Test content for the blog post"
            };

            // Act
            var result = await _service.CreatePostAsync(dto, _userId);

            // Assert
            result.Should().NotBeNull();
            result.Title.Should().Be(dto.Title);
            result.Content.Should().Be(dto.Content);
            result.Author.Should().Be(_user.Username);
            result.Id.Should().BeGreaterThan(0);
        }

        [Fact]
        public async Task GetAllPostsAsync_ShouldReturnAllPosts()
        {
            // Arrange
            _context.BlogPosts.AddRange(
                new BlogPost { Title = "Post 1", Content = "Content 1", Author = _user.Username, UserId = _userId, User = _user, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new BlogPost { Title = "Post 2", Content = "Content 2", Author = _user.Username, UserId = _userId, User = _user, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
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
                Author = _user.Username,
                UserId = _userId,
                User = _user,
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
                Author = _user.Username,
                UserId = _userId,
                User = _user,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();


            var updateDto = new UpdateBlogPostDto
            {
                Title = "Updated Title",
                Content = "Updated content"
            };

            // Act
            var result = await _service.UpdatePostAsync(post.Id, updateDto, _userId);

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
                Author = _user.Username,
                UserId = _userId,
                User = _user,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.DeletePostAsync(post.Id, _userId);

            // Assert
            result.Should().BeTrue();
            var deletedPost = await _context.BlogPosts.FindAsync(post.Id);
            deletedPost.Should().BeNull();
        }

        [Fact]
        public async Task DeletePostAsync_ShouldReturnFalse_WhenPostDoesNotExist()
        {
            // Act
            var result = await _service.DeletePostAsync(999, _userId);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task GetUserPostsAsync_ShouldReturnOnlyUserPosts()
        {
            // Arrange
            var otherUser = new Models.User
            {
                Username = "other",
                Email = "other@example.com",
                PasswordHash = "h",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Users.Add(otherUser);
            await _context.SaveChangesAsync();

            _context.BlogPosts.AddRange(
                new BlogPost { Title = "A", Content = "1", Author = _user.Username, UserId = _userId, User = _user, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new BlogPost { Title = "B", Content = "2", Author = otherUser.Username, UserId = otherUser.Id, User = otherUser, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new BlogPost { Title = "C", Content = "3", Author = _user.Username, UserId = _userId, User = _user, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetUserPostsAsync(_userId);

            // Assert
            result.Should().OnlyContain(r => r.UserId == _userId);
            result.Should().HaveCount(2);
        }

        [Fact]
        public async Task UpdatePostAsync_ShouldThrowUnauthorized_WhenNotOwner()
        {
            // Arrange: create another user and a post owned by them
            var otherUser = new Models.User
            {
                Username = "other2",
                Email = "other2@example.com",
                PasswordHash = "h",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Users.Add(otherUser);
            await _context.SaveChangesAsync();

            var post = new BlogPost
            {
                Title = "Not Yours",
                Content = "Nope",
                Author = otherUser.Username,
                UserId = otherUser.Id,
                User = otherUser,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            var updateDto = new UpdateBlogPostDto { Title = "X", Content = "Y" };

            // Act
            var act = async () => await _service.UpdatePostAsync(post.Id, updateDto, _userId);

            // Assert
            await act.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Fact]
        public async Task DeletePostAsync_ShouldThrowUnauthorized_WhenNotOwner()
        {
            // Arrange: create another user and a post owned by them
            var otherUser = new Models.User
            {
                Username = "other3",
                Email = "other3@example.com",
                PasswordHash = "h",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Users.Add(otherUser);
            await _context.SaveChangesAsync();

            var post = new BlogPost
            {
                Title = "Delete Me",
                Content = "No",
                Author = otherUser.Username,
                UserId = otherUser.Id,
                User = otherUser,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            var act = async () => await _service.DeletePostAsync(post.Id, _userId);

            // Assert
            await act.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Fact]
        public async Task GetPostByIdAsync_ShouldSetIsOwnerAndIncludeUser()
        {
            // Arrange
            var post = new BlogPost
            {
                Title = "OwnerTest",
                Content = "Content",
                Author = _user.Username,
                UserId = _userId,
                User = _user,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            var asOwner = await _service.GetPostByIdAsync(post.Id, _userId);
            var asOther = await _service.GetPostByIdAsync(post.Id, null);

            // Assert
            asOwner.Should().NotBeNull();
            asOwner!.IsOwner.Should().BeTrue();
            asOwner.User.Should().NotBeNull();
            asOwner.User.Username.Should().Be(_user.Username);

            asOther.Should().NotBeNull();
            asOther!.IsOwner.Should().BeFalse();
        }
    }
}