namespace AlertaCalle.API.Models;

public class Incidencia
{
    public int Id { get; set; }
    public float Lat { get; set; }
    public float Lon { get; set; }
    public string Direccion { get; set; } = string.Empty;
    public string FotoUrl { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
    public DateTime FechaActualizacion { get; set; }
    public int IdEstado { get; set; }
    public int IdCategoria { get; set; }
    public int IdUsuario { get; set; }
    public Estado Estado { get; set; } = null!;
    public Categoria Categoria { get; set; } = null!;
    public Usuario Usuario { get; set; } = null!;
    public ICollection<HistorialEstado> HistorialEstados { get; set; } =
        new List<HistorialEstado>();
}
