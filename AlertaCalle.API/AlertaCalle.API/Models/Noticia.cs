namespace AlertaCalle.API.Models;

public class Noticia
{
    public int Id { get; set; }
    public string Categoria { get; set; } = null!;
    public string Titulo { get; set; } = null!;
    public string Descr { get; set; } = null!;
    public string? ImagenUrl { get; set; }
    public string? InfoImportante { get; set; }
    public DateTime FechaCreacion { get; set; }
    public int IdUsuario { get; set; }
    public Usuario Usuario { get; set; } = null!;
}