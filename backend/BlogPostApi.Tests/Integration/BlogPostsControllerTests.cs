using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using BlogPostApi.DTOs;
using FluentAssertions;

namespace BlogPostApi.Tests.Integration;

public class BlogPostsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public BlogPostsControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task CreatePost_ShouldReturnCreatedPost()
    {
        var client = await CreateAuthenticatedClientAsync();
        var dto = new CreateBlogPostDto
        {
            Title = "Integration Test Post",
            Content = "This post ensures the create endpoint works end-to-end."
        };

        var response = await client.PostAsJsonAsync("/api/blogposts", dto);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var created = await response.Content.ReadFromJsonAsync<BlogPostResponseDto>();
        created.Should().NotBeNull();
        created!.Title.Should().Be(dto.Title);
        created.Content.Should().Be(dto.Content);
        created.IsOwner.Should().BeTrue();
    }

    [Fact]
    public async Task GetAllPosts_ShouldIncludeCreatedPost()
    {
        var client = await CreateAuthenticatedClientAsync();
        var dto = new CreateBlogPostDto
        {
            Title = "List Visibility Post",
            Content = "Posts created via API should appear in the public feed."
        };

        await client.PostAsJsonAsync("/api/blogposts", dto);

        var response = await client.GetAsync("/api/blogposts");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var posts = await response.Content.ReadFromJsonAsync<List<BlogPostResponseDto>>();
        posts.Should().NotBeNull();
        posts!.Should().Contain(p => p.Title == dto.Title && p.Content == dto.Content);
    }

    [Fact]
    public async Task UpdatePost_ShouldEnforceOwnership()
    {
        var ownerClient = await CreateAuthenticatedClientAsync();
        var createResponse = await ownerClient.PostAsJsonAsync("/api/blogposts", new CreateBlogPostDto
        {
            Title = "Owner Only Post",
            Content = "Only the owner should be able to update this content."
        });
        var createdPost = await createResponse.Content.ReadFromJsonAsync<BlogPostResponseDto>();
        createdPost.Should().NotBeNull();

        // Owner can update
        var updateDto = new UpdateBlogPostDto
        {
            Title = "Owner Updated Title",
            Content = "Updated content from the owner."
        };

        var ownerUpdate = await ownerClient.PutAsJsonAsync($"/api/blogposts/{createdPost!.Id}", updateDto);
        ownerUpdate.StatusCode.Should().Be(HttpStatusCode.OK);
        var updated = await ownerUpdate.Content.ReadFromJsonAsync<BlogPostResponseDto>();
        updated!.Title.Should().Be(updateDto.Title);

        // Another user attempting to update should be forbidden
        var otherClient = await CreateAuthenticatedClientAsync();
        var otherUpdate = await otherClient.PutAsJsonAsync($"/api/blogposts/{createdPost.Id}", new UpdateBlogPostDto
        {
            Title = "Intruder Edit",
            Content = "This should not succeed."
        });

        otherUpdate.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    private async Task<HttpClient> CreateAuthenticatedClientAsync()
    {
        var client = _factory.CreateClient();
        var unique = Guid.NewGuid().ToString("N");
        var registerDto = new RegisterDto
        {
            Username = $"tester_{unique}",
            Email = $"{unique}@example.com",
            Password = "Test123$",
            FullName = "Integration Tester"
        };

        var registerResponse = await client.PostAsJsonAsync("/api/auth/register", registerDto);
        registerResponse.EnsureSuccessStatusCode();

        var auth = await registerResponse.Content.ReadFromJsonAsync<AuthResponseDto>();
        auth.Should().NotBeNull();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth!.Token);
        return client;
    }
}
