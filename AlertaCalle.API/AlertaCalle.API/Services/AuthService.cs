using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AlertaCalle.API.Configuration;
using AlertaCalle.API.Data;
using AlertaCalle.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AlertaCalle.API.Services;

public sealed class AuthService(ApplicationDbContext db, JwtOptions options) : IAuthService
{
    private readonly PasswordHasher<Usuario> hasher = new();

    public async Task<(TokenDto? Token, Usuario? User)> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken
    )
    {
        var user = await db
            .Usuarios.Include(x => x.Rol)
            .SingleOrDefaultAsync(x => x.Email == email, cancellationToken);
        if (
            user is null
            || hasher.VerifyHashedPassword(user, user.Password, password)
                == PasswordVerificationResult.Failed
            || string.IsNullOrWhiteSpace(options.Key)
        )
            return (null, null);
        var expires = DateTime.UtcNow.AddMinutes(
            options.ExpirationMinutes > 0 ? options.ExpirationMinutes : 60
        );
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Rol.Nombre),
            new Claim("permissions", user.Rol.Permisos),
        };
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Key)),
            SecurityAlgorithms.HmacSha256
        );
        var token = new JwtSecurityToken(
            options.Issuer,
            options.Audience,
            claims,
            expires: expires,
            signingCredentials: credentials
        );
        return (new TokenDto(new JwtSecurityTokenHandler().WriteToken(token), expires), user);
    }

    public async Task<bool> ChangePasswordAsync(
        int userId,
        string currentPassword,
        string newPassword,
        CancellationToken cancellationToken
    )
    {
        var user = await db.Usuarios.SingleOrDefaultAsync(x => x.Id == userId, cancellationToken);
        if (
            user is null
            || hasher.VerifyHashedPassword(user, user.Password, currentPassword)
                == PasswordVerificationResult.Failed
        )
            return false;
        user.Password = hasher.HashPassword(user, newPassword);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> RegisterAsync(
        string email,
        string password,
        CancellationToken cancellationToken
    )
    {
        // acá
        var user = new Usuario
        {
            Email = email,
            Pass = hasher.HashPassword(null!, password),
            
        };
        await db.Usuarios.AddAsync(user, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}
