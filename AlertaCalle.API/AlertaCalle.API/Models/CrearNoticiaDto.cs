using System.ComponentModel.DataAnnotations;

namespace AlertaCalle.API.Models;

public sealed class CrearNoticiaDto
{
    [Required]
    public string Categoria { get; init; } = string.Empty;

    [Required]
    public string Titulo { get; init; } = string.Empty;

    [Required]
    public string Descr { get; init; } = string.Empty;

    public string? ImagenUrl { get; init; }
    public string? InfoImportante { get; init; }
}