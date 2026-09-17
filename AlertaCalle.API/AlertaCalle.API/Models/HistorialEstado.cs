namespace AlertaCalle.API.Models;

public class HistorialEstado
{
    public int Id { get; set; }
    public DateTime FechaCambio { get; set; }
    public string Comentario { get; set; } = string.Empty;
    public int IdUsuario { get; set; }
    public int IdEstado { get; set; }
    public int IdIncidencia { get; set; }
    public Usuario Usuario { get; set; } = null!;
    public Estado Estado { get; set; } = null!;
    public Incidencia Incidencia { get; set; } = null!;
}
