using AlertaCalle.API.Configuration;
using AlertaCalle.API.Models;
using AlertaCalle.API.Services;
using Microsoft.AspNetCore.Identity;
using Xunit;

namespace AlertaCalle.API.Tests;

public sealed class AuthServiceTests : ApiTestBase
{
    private const string SigningKey = "test-key-with-at-least-32-characters";

    [Fact]
    public async Task RefreshAsync_issues_a_new_access_token_and_keeps_the_session_deadline()
    {
        await using var db = CreateDb(nameof(RefreshAsync_issues_a_new_access_token_and_keeps_the_session_deadline));
        var user = await CreateUserAsync(db);
        var service = new AuthService(db, CreateOptions());

        var login = await service.LoginAsync(user.Email, "password123", default);
        Assert.NotNull(login.Token);

        var refreshed = await service.RefreshAsync(login.Token.RefreshToken, default);

        Assert.NotNull(refreshed);
        Assert.NotEqual(login.Token.Token, refreshed.Token);
        Assert.Equal(login.Token.RefreshTokenExpiresAt, refreshed.RefreshTokenExpiresAt);
    }

    [Fact]
    public async Task RefreshAsync_rejects_access_tokens_and_invalid_refresh_tokens()
    {
        await using var db = CreateDb(nameof(RefreshAsync_rejects_access_tokens_and_invalid_refresh_tokens));
        var user = await CreateUserAsync(db);
        var service = new AuthService(db, CreateOptions());
        var login = await service.LoginAsync(user.Email, "password123", default);
        Assert.NotNull(login.Token);

        Assert.Null(await service.RefreshAsync(login.Token.Token, default));
        Assert.Null(await service.RefreshAsync("not-a-jwt", default));
    }

    private static JwtOptions CreateOptions() =>
        new()
        {
            Key = SigningKey,
            Issuer = "AlertaCalle.Tests",
            Audience = "AlertaCalle.Client",
            ExpirationMinutes = 1,
            RefreshTokenExpirationDays = 30,
        };

    private static async Task<Usuario> CreateUserAsync(
        AlertaCalle.API.Data.ApplicationDbContext db
    )
    {
        var role = new Rol { Id = 1, Nombre = "User", Permisos = "reportar" };
        var user = new Usuario
        {
            Id = 1,
            Nombre = "Test",
            Apellido = "User",
            Email = "test@example.com",
            FechaCreacion = DateTime.UtcNow,
            IdRol = role.Id,
            Rol = role,
        };
        user.Password = new PasswordHasher<Usuario>().HashPassword(user, "password123");
        db.Roles.Add(role);
        db.Usuarios.Add(user);
        await db.SaveChangesAsync();
        return user;
    }
}
