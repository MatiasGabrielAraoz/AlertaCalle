namespace AlertaCalle.API.Models;

public class Usuario
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
    public string Password { get; set; } = string.Empty;
    public int IdRol { get; set; }
    public Rol Rol { get; set; } = null!;
    public ICollection<Incidencia> Incidencias { get; set; } = new List<Incidencia>();
    public ICollection<HistorialEstado> HistorialEstados { get; set; } =
        new List<HistorialEstado>();
}
