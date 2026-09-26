namespace AlertaCalle.API.Models;

public class Categoria
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descr { get; set; }
    public ICollection<Incidencia> Incidencias { get; set; } = new List<Incidencia>();
}
