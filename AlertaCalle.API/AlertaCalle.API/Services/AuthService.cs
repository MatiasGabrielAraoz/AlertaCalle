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
    private readonly JwtSecurityTokenHandler tokenHandler = new();

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
        return (CreateTokenPair(user, DateTime.UtcNow.AddDays(RefreshTokenExpirationDays)), user);
    }

    public async Task<TokenDto?> RefreshAsync(
        string refreshToken,
        CancellationToken cancellationToken
    )
    {
        if (string.IsNullOrWhiteSpace(options.Key) || string.IsNullOrWhiteSpace(refreshToken))
            return null;

        ClaimsPrincipal principal;
        SecurityToken validatedToken;
        try
        {
            principal = tokenHandler.ValidateToken(
                refreshToken,
                new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Key)),
                    ValidateIssuer = !string.IsNullOrWhiteSpace(options.Issuer),
                    ValidIssuer = options.Issuer,
                    ValidateAudience = true,
                    ValidAudience = RefreshAudience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1),
                },
                out validatedToken
            );
        }
        catch (SecurityTokenException)
        {
            return null;
        }
        catch (ArgumentException)
        {
            return null;
        }
        catch (FormatException)
        {
            return null;
        }

        if (
            principal.FindFirstValue("token_type") != "refresh"
            || !int.TryParse(
                principal.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub),
                out var userId
            )
            || validatedToken is not JwtSecurityToken jwt
            || jwt.ValidTo <= DateTime.UtcNow
        )
            return null;

        var user = await db
            .Usuarios.Include(x => x.Rol)
            .SingleOrDefaultAsync(x => x.Id == userId, cancellationToken);
        return user is null ? null : CreateTokenPair(user, jwt.ValidTo);
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
        int? idRol,
        string email,
        string password,
        CancellationToken cancellationToken
    )
    {
        if (db.Usuarios.Any(u => u.Email == email)) return false;
        
        var user = new Usuario
        {
            Email = email,
            Password = hasher.HashPassword(null!, password),
            FechaCreacion = DateTime.UtcNow,
            IdRol = idRol ?? 2 // si es null se toma como usuario
            
            
        };
        
        await db.Usuarios.AddAsync(user, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        
        return true;
    }

    private TokenDto CreateTokenPair(Usuario user, DateTime refreshTokenExpiresAt)
    {
        var now = DateTime.UtcNow;
        var expiresAt = now.AddMinutes(options.ExpirationMinutes > 0 ? options.ExpirationMinutes : 60);
        refreshTokenExpiresAt = DateTimeOffset
            .FromUnixTimeSeconds(new DateTimeOffset(refreshTokenExpiresAt).ToUnixTimeSeconds())
            .UtcDateTime;
        var commonClaims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Rol.Nombre),
            new Claim("permissions", user.Rol.Permisos),
        };
        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Key)),
            SecurityAlgorithms.HmacSha256
        );
        var accessToken = new JwtSecurityToken(
            options.Issuer,
            options.Audience,
            commonClaims.Append(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))),
            expires: expiresAt,
            signingCredentials: signingCredentials
        );
        var refreshClaims = commonClaims
            .Append(new Claim("token_type", "refresh"))
            .Append(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")));
        var refreshToken = new JwtSecurityToken(
            options.Issuer,
            RefreshAudience,
            refreshClaims,
            expires: refreshTokenExpiresAt,
            signingCredentials: signingCredentials
        );

        return new TokenDto(
            tokenHandler.WriteToken(accessToken),
            expiresAt,
            tokenHandler.WriteToken(refreshToken),
            refreshTokenExpiresAt
        );
    }

    private string RefreshAudience => $"{options.Audience}:refresh";

    private int RefreshTokenExpirationDays =>
        options.RefreshTokenExpirationDays > 0 ? options.RefreshTokenExpirationDays : 30;
}
