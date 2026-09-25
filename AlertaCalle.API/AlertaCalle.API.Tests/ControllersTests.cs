using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AlertaCalle.API.Controllers;
using AlertaCalle.API.Models;
using AlertaCalle.API.Models.Enums;
using AlertaCalle.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace AlertaCalle.API.Tests;

public sealed class ControllersTests : ApiTestBase
{
    [Fact]
    public async Task Categorias_endpoints_cover_crud_and_missing_records()
    {
        await using var db = CreateDb(nameof(Categorias_endpoints_cover_crud_and_missing_records));
        var controller = new CategoriasController(db);

        Assert.IsType<OkObjectResult>((await controller.All(default)).Result);
        var created = Assert.IsType<CreatedAtActionResult>(
            (await controller.Post(new Categoria { Nombre = "Baches", Descr = "Calles" }, default)).Result);
        var category = Assert.IsType<Categoria>(created.Value);
        Assert.IsType<OkObjectResult>((await controller.Get(category.Id, default)).Result);
        Assert.IsType<NotFoundResult>((await controller.Get(999, default)).Result);
        Assert.IsType<BadRequestResult>(
            await controller.Put(2, new Categoria { Id = 1, Nombre = "Otro" }, default));
        Assert.IsType<NotFoundResult>(
            await controller.Put(999, new Categoria { Id = 999, Nombre = "Otro" }, default));
        db.ChangeTracker.Clear();
        Assert.IsType<NoContentResult>(
            await controller.Put(category.Id, new Categoria { Id = category.Id, Nombre = "Baches nuevos" }, default));
        Assert.IsType<NoContentResult>(await controller.Delete(category.Id, default));
        Assert.IsType<NotFoundResult>(await controller.Delete(999, default));
    }

    [Fact]
    public async Task Estados_endpoints_cover_both_routes_and_crud()
    {
        await using var db = CreateDb(nameof(Estados_endpoints_cover_both_routes_and_crud));
        var controller = new EstadosController(db);
        var created = Assert.IsType<CreatedAtActionResult>(
            (await controller.Post(new Estado { Valor = EstadoEnum.SinResolver }, default)).Result);
        var state = Assert.IsType<Estado>(created.Value);

        Assert.IsType<OkObjectResult>((await controller.All(default)).Result);
        Assert.IsType<OkObjectResult>((await controller.Get(state.Id, default)).Result);
        Assert.IsType<NotFoundResult>((await controller.Get(999, default)).Result);
        Assert.IsType<BadRequestResult>(
            await controller.Put(2, new Estado { Id = 1, Valor = EstadoEnum.Resuelto }, default));
        Assert.IsType<NotFoundResult>(
            await controller.Put(999, new Estado { Id = 999, Valor = EstadoEnum.Resuelto }, default));
        db.ChangeTracker.Clear();
        Assert.IsType<NoContentResult>(
            await controller.Put(state.Id, new Estado { Id = state.Id, Valor = EstadoEnum.Resuelto }, default));
        Assert.IsType<NoContentResult>(await controller.Delete(state.Id, default));
        Assert.IsType<NotFoundResult>(await controller.Delete(999, default));
    }

    [Fact]
    public async Task Roles_endpoints_cover_crud()
    {
        await using var db = CreateDb(nameof(Roles_endpoints_cover_crud));
        var controller = new RolesController(db);
        var created = Assert.IsType<CreatedAtActionResult>(
            (await controller.Post(new Rol { Nombre = "Vecino", Permisos = "reportar" }, default)).Result);
        var role = Assert.IsType<Rol>(created.Value);

        Assert.IsType<OkObjectResult>((await controller.All(default)).Result);
        Assert.IsType<OkObjectResult>((await controller.Get(role.Id, default)).Result);
        Assert.IsType<NotFoundResult>((await controller.Get(999, default)).Result);
        Assert.IsType<BadRequestResult>(
            await controller.Put(2, new Rol { Id = 1, Nombre = "Otro" }, default));
        Assert.IsType<NotFoundResult>(
            await controller.Put(999, new Rol { Id = 999, Nombre = "Otro" }, default));
        db.ChangeTracker.Clear();
        Assert.IsType<NoContentResult>(
            await controller.Put(role.Id, new Rol { Id = role.Id, Nombre = "Vecino actualizado" }, default));
        Assert.IsType<NoContentResult>(await controller.Delete(role.Id, default));
        Assert.IsType<NotFoundResult>(await controller.Delete(999, default));
    }

    [Fact]
    public async Task Usuarios_endpoints_cover_crud_and_hash_passwords()
    {
        await using var db = CreateDb(nameof(Usuarios_endpoints_cover_crud_and_hash_passwords));
        var controller = new UsuariosController(db);
        var created = Assert.IsType<CreatedAtActionResult>(
            (await controller.Post(new Usuario
            {
                Nombre = "Ana",
                Apellido = "García",
                Email = "ana@example.com",
                Password = "secret",
                IdRol = 2
            }, default)).Result);
        var user = Assert.IsType<Usuario>(created.Value);

        Assert.NotEqual("secret", user.Password);
        Assert.IsType<OkObjectResult>((await controller.GetAll(default)).Result);
        Assert.IsType<OkObjectResult>((await controller.Get(user.Id, default)).Result);
        Assert.IsType<NotFoundResult>((await controller.Get(999, default)).Result);
        Assert.IsType<BadRequestResult>(
            await controller.Put(2, new Usuario { Id = 1, Password = "secret" }, default));
        Assert.IsType<NotFoundResult>(
            await controller.Put(999, new Usuario { Id = 999, Password = "secret" }, default));
        Assert.IsType<NoContentResult>(
            await controller.Put(user.Id, new Usuario { Id = user.Id, Email = user.Email, Password = "new-secret" }, default));
        Assert.IsType<NoContentResult>(await controller.Delete(user.Id, default));
        Assert.IsType<NotFoundResult>(await controller.Delete(999, default));
    }

    [Fact]
    public async Task HistorialEstados_endpoints_cover_crud()
    {
        await using var db = CreateDb(nameof(HistorialEstados_endpoints_cover_crud));
        var controller = new HistorialEstadosController(db);
        var created = Assert.IsType<CreatedAtActionResult>(
            (await controller.Post(new HistorialEstado
            {
                Comentario = "Recibido",
                IdUsuario = 1,
                IdEstado = 1,
                IdIncidencia = 1
            }, default)).Result);
        var history = Assert.IsType<HistorialEstado>(created.Value);

        Assert.IsType<OkObjectResult>((await controller.All(default)).Result);
        Assert.IsType<OkObjectResult>((await controller.Get(history.Id, default)).Result);
        Assert.IsType<NotFoundResult>((await controller.Get(999, default)).Result);
        Assert.IsType<BadRequestResult>(
            await controller.Put(2, new HistorialEstado { Id = 1, Comentario = "Otro" }, default));
        Assert.IsType<NotFoundResult>(
            await controller.Put(999, new HistorialEstado { Id = 999, Comentario = "Otro" }, default));
        db.ChangeTracker.Clear();
        Assert.IsType<NoContentResult>(
            await controller.Put(history.Id, new HistorialEstado { Id = history.Id, Comentario = "Actualizado" }, default));
        Assert.IsType<NoContentResult>(await controller.Delete(history.Id, default));
        Assert.IsType<NotFoundResult>(await controller.Delete(999, default));
    }

    [Fact]
    public async Task Incidencias_endpoints_cover_crud_and_authentication_requirements_at_action_level()
    {
        await using var db = CreateDb(nameof(Incidencias_endpoints_cover_crud_and_authentication_requirements_at_action_level));
        var controller = new IncidenciasController(db);
        var created = Assert.IsType<CreatedAtActionResult>(
            (await controller.Post(new PostIncidenciaDto
            {
                Direccion = "Av. Siempre Viva 123",
                Titulo = "Bache",
                Descr = "Grande",
                FotoUrl = "",
                IdCategoria = 1,
                IdUsuario = 1
            }, default)).Result);
        var incident = Assert.IsType<Incidencia>(created.Value);

        Assert.IsType<OkObjectResult>((await controller.All(default)).Result);
        Assert.IsType<OkObjectResult>((await controller.Get(incident.Id, default)).Result);
        Assert.IsType<NotFoundResult>((await controller.Get(999, default)).Result);
        Assert.IsType<BadRequestResult>(
            await controller.Put(2, new Incidencia { Id = 1 }, default));
        Assert.IsType<NotFoundResult>(
            await controller.Put(999, new Incidencia { Id = 999 }, default));
        db.ChangeTracker.Clear();
        Assert.IsType<NoContentResult>(
            await controller.Put(incident.Id, new Incidencia
            {
                Id = incident.Id,
                Direccion = "Nueva dirección",
                FotoUrl = "",
                Titulo = "Bache",
                Descr = "Actualizado",
                IdEstado = 1,
                IdCategoria = 1,
                IdUsuario = 1
            }, default));
        Assert.IsType<NoContentResult>(await controller.Delete(incident.Id, default));
        Assert.IsType<NotFoundResult>(await controller.Delete(999, default));
    }

    [Fact]
    public async Task Auth_endpoints_delegate_login_register_and_password_change()
    {
        var token = new TokenDto("jwt", DateTime.UtcNow.AddHours(1));
        var service = new FakeAuthService
        {
            LoginResult = (token, new Usuario { Id = 7 }),
            RegisterResult = true,
            ChangePasswordResult = true
        };
        var controller = new AuthController(service);
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, "7"),
            new Claim(JwtRegisteredClaimNames.Email, "ana@example.com"),
            new Claim(ClaimTypes.Role, "Vecino"),
            new Claim("permissions", "reportar")
        }, "test"));
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        Assert.IsType<OkObjectResult>(
            await controller.Login(new PostLoginDto { Email = "ana@example.com", Password = "secret" }, default));
        Assert.IsType<UnauthorizedObjectResult>(
            await new AuthController(new FakeAuthService()).Login(new PostLoginDto(), default));
        Assert.IsType<NoContentResult>(
            await controller.Register(new PostLoginDto { Email = "new@example.com", Password = "secret" }, default));
        Assert.IsType<NoContentResult>(
            await controller.ChangePassword(new ChangePasswordDto
            {
                CurrentPassword = "old",
                NewPassword = "new-password"
            }, default));
        Assert.IsType<OkObjectResult>(controller.Me());
    }

    private sealed class FakeAuthService : IAuthService
    {
        public (TokenDto? Token, Usuario? User) LoginResult { get; init; }
        public bool RegisterResult { get; init; }
        public bool ChangePasswordResult { get; init; }

        public Task<(TokenDto? Token, Usuario? User)> LoginAsync(
            string email, string password, CancellationToken cancellationToken) =>
            Task.FromResult(LoginResult);

        public Task<bool> ChangePasswordAsync(
            int userId, string currentPassword, string newPassword,
            CancellationToken cancellationToken) =>
            Task.FromResult(ChangePasswordResult);

        public Task<bool> RegisterAsync(
            int? idRol, string nombre, string apellido, string email, string password,
            CancellationToken cancellationToken) =>
            Task.FromResult(RegisterResult);
    }
}
