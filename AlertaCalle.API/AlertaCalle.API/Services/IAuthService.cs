using AlertaCalle.API.Models;

namespace AlertaCalle.API.Services;

public interface IAuthService
{
    Task<(TokenDto? Token, Usuario? User)> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken
    );
    Task<bool> ChangePasswordAsync(
        int userId,
        string currentPassword,
        string newPassword,
        CancellationToken cancellationToken
    );
    Task<bool> RegisterAsync(
        int? idRol,
        string email,
        string password,
        CancellationToken cancellationToken
    );
}
