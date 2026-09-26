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

    [HttpPost("upload-image"), Authorize(Roles = "Admin")]
    [RequestSizeLimit(5 * 1024 * 1024)] // 5 MB
    public async Task<IActionResult> UploadImage(IFormFile file, CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No se subió ningún archivo." });

        // Validar que sea imagen
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest(new { message = "Tipo de archivo no permitido. Usá JPG, PNG, GIF o WEBP." });

        // Crear nombre único
        var fileName = $"{Guid.NewGuid()}{extension}";

        // Buscar la carpeta AlertaCalle.Web subiendo desde el directorio actual
        var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
        string? targetDir = null;
        while (dir != null)
        {
            var candidate = Path.Combine(dir.FullName, "AlertaCalle.Web", "img", "noticias");
            if (Directory.Exists(Path.Combine(dir.FullName, "AlertaCalle.Web")))
            {
                targetDir = candidate;
                break;
            }
            dir = dir.Parent;
        }

        if (targetDir == null)
            return StatusCode(500, new { message = "No se encontró la carpeta AlertaCalle.Web en el servidor." });

        if (!Directory.Exists(targetDir))
            Directory.CreateDirectory(targetDir);

        var filePath = Path.Combine(targetDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        // Devolver la URL relativa que usará el frontend
        return Ok(new { url = $"img/noticias/{fileName}" });
    }
}