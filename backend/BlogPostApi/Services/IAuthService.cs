using BlogPostApi.DTOs;

namespace BlogPostApi.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task<UserDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto);
    }
}