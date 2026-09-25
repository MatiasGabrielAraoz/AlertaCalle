using System.ComponentModel.DataAnnotations;

namespace AlertaCalle.API.Models;

public sealed class PostLoginDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required] 
    public string Surname { get; set; } = string.Empty;

    [Required]
    public string Email { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}
