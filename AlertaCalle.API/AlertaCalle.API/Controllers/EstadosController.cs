using AlertaCalle.API.Data;
using AlertaCalle.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlertaCalle.API.Controllers;

[ApiController]
[Route("estados")]
[Route("accidentes/estados")]
public class EstadosController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Estado>>> All(CancellationToken cancellationToken)
    {
        return Ok(await db.Estados.AsNoTracking().ToListAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Estado>> Get(int id, CancellationToken cancellationToken)
    {
        var estado = await db.Estados.FindAsync([id], cancellationToken);

        return estado is null ? NotFound() : Ok(estado);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Estado>> Post(Estado estado, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        db.Add(estado);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(Get), new { id = estado.Id }, estado);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Put(int id, Estado estado, CancellationToken cancellationToken)
    {
        if (id != estado.Id)
            return BadRequest();

        if (!await db.Estados.AnyAsync(estadoDb => estadoDb.Id == id, cancellationToken))
        {
            return NotFound();
        }

        db.Entry(estado).State = EntityState.Modified;
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var estado = await db.Estados.FindAsync([id], cancellationToken);

        if (estado is null)
            return NotFound();

        db.Remove(estado);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
