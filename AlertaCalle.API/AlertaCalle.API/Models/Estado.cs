using EstadoValor = AlertaCalle.API.Models.Enums.EstadoEnum;

namespace AlertaCalle.API.Models;

public class Estado
{
    public int Id { get; set; }
    public EstadoValor Valor { get; set; }
    public ICollection<Incidencia> Incidencias { get; set; } = new List<Incidencia>();
    public ICollection<HistorialEstado> HistorialEstados { get; set; } =
        new List<HistorialEstado>();
}
