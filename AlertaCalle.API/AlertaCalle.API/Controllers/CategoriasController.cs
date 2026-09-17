using AlertaCalle.API.Data;
using AlertaCalle.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlertaCalle.API.Controllers;

[ApiController]
[Route("categorias")]
public class CategoriasController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Categoria>>> All(CancellationToken cancellationToken)
    {
        return Ok(await db.Categorias.AsNoTracking().ToListAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Categoria>> Get(int id, CancellationToken cancellationToken)
    {
        var categoria = await db.Categorias.FindAsync([id], cancellationToken);

        return categoria is null ? NotFound() : Ok(categoria);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Categoria>> Post(
        Categoria categoria,
        CancellationToken cancellationToken
    )
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        db.Add(categoria);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(Get), new { id = categoria.Id }, categoria);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Put(
        int id,
        Categoria categoria,
        CancellationToken cancellationToken
    )
    {
        if (id != categoria.Id)
            return BadRequest();

        if (!await db.Categorias.AnyAsync(categoriaDb => categoriaDb.Id == id, cancellationToken))
        {
            return NotFound();
        }

        db.Entry(categoria).State = EntityState.Modified;
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var categoria = await db.Categorias.FindAsync([id], cancellationToken);

        if (categoria is null)
            return NotFound();

        db.Remove(categoria);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
