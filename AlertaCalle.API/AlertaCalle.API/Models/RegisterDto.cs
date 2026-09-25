using System.ComponentModel.DataAnnotations;

namespace AlertaCalle.API.Models;

public class RegisterDto
{
    [Required]
    public string Name { get; init; }
    [Required]
    public string Surname { get; init; }
    
    [Required]
    [EmailAddress]
    public string Email { get; init; }
    
    public string? Dni { get; init; }

    [Required]
    public string Password { get; init; }
    
}