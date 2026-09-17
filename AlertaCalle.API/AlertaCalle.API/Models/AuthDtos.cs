using System.ComponentModel.DataAnnotations;

namespace AlertaCalle.API.Models;

public sealed class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; init; } = string.Empty;

    [Required, MinLength(8)]
    public string NewPassword { get; init; } = string.Empty;
}

public sealed record TokenDto(string Token, DateTime ExpiresAt);

public sealed record MeDto(int Id, string Email, string Role, string Permissions);
