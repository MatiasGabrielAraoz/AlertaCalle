using System.ComponentModel.DataAnnotations;

namespace AlertaCalle.API.Models;

public class RegisterDto
{
    [Required]
    public string Name { get; init; } = null!;
    [Required]
    public string Surname { get; init; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = null!;

    public string? Dni { get; init; }

    [Required]
    public string Password { get; init; } = null!;  

}