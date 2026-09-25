using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AlertaCalle.API.Models;
using AlertaCalle.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlertaCalle.API.Controllers;

[ApiController, Route("auth")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login"), AllowAnonymous]
    public async Task<IActionResult> Login(
        PostLoginDto request,
        CancellationToken cancellationToken
    )
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var result = await authService.LoginAsync(
            request.Email,
            request.Password,
            cancellationToken
        );
        return result.Token is null
            ? Unauthorized(new { message = "Credenciales inválidas." })
            : Ok(result.Token);
    }

    [HttpPost("register"), AllowAnonymous]
    public async Task<IActionResult> Register(
        RegisterDto request,
        CancellationToken cancellationToken
    )
    {
        
        var result = await authService.RegisterAsync(
            null,
            request.Name,
            request.Surname,
            request.Email,
            request.Password,
            cancellationToken);
        if (result) return NoContent();
        else return Conflict();

    }

    [HttpPost("change-password"), Authorize]
    public async Task<IActionResult> ChangePassword(
        ChangePasswordDto request,
        CancellationToken cancellationToken
    )
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        if (
            !int.TryParse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub),
                out var id
            )
        )
            return Unauthorized();
        return await authService.ChangePasswordAsync(
            id,
            request.CurrentPassword,
            request.NewPassword,
            cancellationToken
        )
            ? NoContent()
            : BadRequest(new { message = "La contraseña actual no es válida." });
    }

    [HttpGet("me"), Authorize]
    public IActionResult Me()
    {
        if (
            !int.TryParse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub),
                out var id
            )
        )
            return Unauthorized();
        return Ok(
            new MeDto(
                id,
                User.FindFirstValue("nombre") ?? string.Empty,
                User.FindFirstValue("apellido") ?? string.Empty,
                User.FindFirstValue(ClaimTypes.Email)
                    ?? User.FindFirstValue(JwtRegisteredClaimNames.Email)
                    ?? string.Empty,
                User.FindFirstValue(ClaimTypes.Role) ?? string.Empty,
                User.FindFirstValue("permissions") ?? string.Empty
            )
        );
    }
}
