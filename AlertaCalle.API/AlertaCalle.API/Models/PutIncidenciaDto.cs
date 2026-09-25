namespace AlertaCalle.API.Models;

public class PutIncidenciaDto
{
    public string? Direccion { get; set; }
    public string? FotoUrl { get; set; }
    public string? Titulo { get; set; }
    public string? Descr { get; set; }
    public int? IdCategoria { get; set; }
    public int? IdEstado { get; set; }
}
