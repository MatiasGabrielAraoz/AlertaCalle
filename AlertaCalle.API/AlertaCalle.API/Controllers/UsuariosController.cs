using AlertaCalle.API.Data;
using AlertaCalle.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlertaCalle.API.Controllers;

[ApiController, Route("usuarios")]
public class UsuariosController(ApplicationDbContext db) : ControllerBase
{
    private readonly PasswordHasher<Usuario> passwordHasher = new();

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetAll(CancellationToken ct) =>
        Ok(await db.Usuarios.AsNoTracking().ToListAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Usuario>> Get(int id, CancellationToken ct)
    {
        var x = await db.Usuarios.AsNoTracking().FirstOrDefaultAsync(v => v.Id == id, ct);
        return x is null ? NotFound() : Ok(x);
    }

    [HttpPost, Authorize]
    public async Task<ActionResult<Usuario>> Post(Usuario x, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        x.FechaCreacion = x.FechaCreacion == default ? DateTime.UtcNow : x.FechaCreacion;
        x.Password = passwordHasher.HashPassword(x, x.Password);
        db.Usuarios.Add(x);
        await db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(Get), new { id = x.Id }, x);
    }

    [HttpPut("{id:int}"), Authorize]
    public async Task<IActionResult> Put(int id, Usuario x, CancellationToken ct)
    {
        if (id != x.Id)
            return BadRequest();
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var current = await db.Usuarios.FindAsync([id], ct);
        if (current is null)
            return NotFound();
        x.Password = passwordHasher.HashPassword(x, x.Password);
        db.Entry(current).CurrentValues.SetValues(x);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("{id:int}"), Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var x = await db.Usuarios.FindAsync([id], ct);
        if (x is null)
            return NotFound();
        db.Remove(x);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }
    
    [HttpPut("admin/set"), Authorize]
    public async Task<IActionResult> SetAdminRole([FromBody] SetAdminPost request, CancellationToken ct)
    {
        if (request.adminSecret == Environment.GetEnvironmentVariable("ADMIN_SECRET_KEY"))
        {
        }

        var user = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == request.email, ct);
        
        return NoContent();

    }
}
