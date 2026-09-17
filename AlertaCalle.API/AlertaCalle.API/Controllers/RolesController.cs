using AlertaCalle.API.Data;
using AlertaCalle.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlertaCalle.API.Controllers;

[ApiController, Route("roles")]
public class RolesController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Rol>>> All(CancellationToken c) =>
        Ok(await db.Roles.AsNoTracking().ToListAsync(c));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Rol>> Get(int id, CancellationToken c)
    {
        var x = await db.Roles.FindAsync([id], c);
        return x is null ? NotFound() : Ok(x);
    }

    [HttpPost, Authorize]
    public async Task<ActionResult<Rol>> Post(Rol x, CancellationToken c)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        db.Add(x);
        await db.SaveChangesAsync(c);
        return CreatedAtAction(nameof(Get), new { id = x.Id }, x);
    }

    [HttpPut("{id:int}"), Authorize]
    public async Task<IActionResult> Put(int id, Rol x, CancellationToken c)
    {
        if (id != x.Id)
            return BadRequest();
        if (!await db.Roles.AnyAsync(v => v.Id == id, c))
            return NotFound();
        db.Entry(x).State = EntityState.Modified;
        await db.SaveChangesAsync(c);
        return NoContent();
    }

    [HttpDelete("{id:int}"), Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken c)
    {
        var x = await db.Roles.FindAsync([id], c);
        if (x is null)
            return NotFound();
        db.Remove(x);
        await db.SaveChangesAsync(c);
        return NoContent();
    }
}
