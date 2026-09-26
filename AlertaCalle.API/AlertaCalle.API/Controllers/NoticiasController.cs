using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AlertaCalle.API.Data;
using AlertaCalle.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlertaCalle.API.Controllers;

[ApiController, Route("noticias")]
public sealed class NoticiasController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet, AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Noticia>>> All(CancellationToken cancellationToken) =>
        Ok(await db.Noticias
            .AsNoTracking()
            .OrderByDescending(x => x.FechaCreacion)
            .ToListAsync(cancellationToken));

    [HttpGet("{id}"), AllowAnonymous]
    public async Task<IActionResult> ById(int id, CancellationToken cancellationToken)
    {
        var noticia = await db.Noticias.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        return noticia is null ? NotFound() : Ok(noticia);
    }

    [HttpPost, Authorize(Roles = "Admin")]
    public async Task<IActionResult> Crear(CrearNoticiaDto dto, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (!int.TryParse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub),
                out var idUsuario))
            return Unauthorized();

        var noticia = new Noticia
        {
            Categoria = dto.Categoria,
            Titulo = dto.Titulo,
            Descr = dto.Descr,
            ImagenUrl = dto.ImagenUrl,
            InfoImportante = dto.InfoImportante,
            FechaCreacion = DateTime.UtcNow,
            IdUsuario = idUsuario
        };

        db.Noticias.Add(noticia);
        await db.SaveChangesAsync(cancellationToken);

        return Created($"/noticias/{noticia.Id}", noticia);
    }

    [HttpDelete("{id}"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> Eliminar(int id, CancellationToken cancellationToken)
    {
        var noticia = await db.Noticias.FindAsync([id], cancellationToken);
        if (noticia is null) return NotFound();

        db.Noticias.Remove(noticia);
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}