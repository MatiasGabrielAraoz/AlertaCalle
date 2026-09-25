namespace AlertaCalle.API.Models;

public class PostIncidenciaDto
{
    public string Direccion { get; set; } = string.Empty;
    public string? FotoUrl { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descr { get; set; } = string.Empty;
    public int IdCategoria { get; set; }
    public int IdUsuario { get; set; }
}
