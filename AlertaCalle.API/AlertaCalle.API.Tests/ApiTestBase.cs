using AlertaCalle.API.Data;
using Microsoft.EntityFrameworkCore;

namespace AlertaCalle.API.Tests;

public abstract class ApiTestBase
{
    protected static ApplicationDbContext CreateDb(string name)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(name)
            .Options;
        return new ApplicationDbContext(options);
    }
}
