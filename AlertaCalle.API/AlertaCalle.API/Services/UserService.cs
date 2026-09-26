using AlertaCalle.API.Configuration;
using AlertaCalle.API.Data;

namespace AlertaCalle.API.Services;

public sealed class UserService(ApplicationDbContext db, JwtOptions options) : IUserService
{

}