using AlertaCalle.API.Data;
using AlertaCalle.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlertaCalle.API.Controllers;

[ApiController, Route("incidencias")]
public class IncidenciasController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Incidencia>>> All(
        CancellationToken cancellationToken)
    {
        return Ok(await db.Incidencias
            .AsNoTracking()
            .ToListAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Incidencia>> Get(
        int id,
        CancellationToken cancellationToken)
    {
        var incidencia = await db.Incidencias
            .AsNoTracking()
            .FirstOrDefaultAsync(
                incidenciaDb => incidenciaDb.Id == id,
                cancellationToken);

        return incidencia is null
            ? NotFound()
            : Ok(incidencia);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Incidencia>> Post(
        PostIncidenciaDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var incidencia = new Incidencia
        {
            Direccion = dto.Direccion,
            FotoUrl = dto.FotoUrl,
            Titulo = dto.Titulo,
            Descr = dto.Descr,
            FechaCreacion = DateTime.UtcNow,
            FechaActualizacion = DateTime.UtcNow,
            IdEstado = 1,
            IdCategoria = dto.IdCategoria,
            IdUsuario = dto.IdUsuario
        };

        db.Add(incidencia);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(Get),
            new { id = incidencia.Id },
            incidencia);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Put(
        int id,
        Incidencia incidencia,
        CancellationToken cancellationToken)
    {
        if (id != incidencia.Id)
            return BadRequest();

        if (!await db.Incidencias.AnyAsync(
                incidenciaDb => incidenciaDb.Id == id,
                cancellationToken))
        {
            return NotFound();
        }

        incidencia.FechaActualizacion = DateTime.UtcNow;
        db.Entry(incidencia).State = EntityState.Modified;
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(
        int id,
        CancellationToken cancellationToken)
    {
        var incidencia = await db.Incidencias.FindAsync([id], cancellationToken);

        if (incidencia is null)
            return NotFound();

        db.Remove(incidencia);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
