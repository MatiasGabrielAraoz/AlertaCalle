using AlertaCalle.API.Models;
using Microsoft.EntityFrameworkCore;
using EstadoValor = AlertaCalle.API.Models.Enums.EstadoEnum;

namespace AlertaCalle.API.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options)
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Estado> Estados => Set<Estado>();
    public DbSet<Incidencia> Incidencias => Set<Incidencia>();
    public DbSet<HistorialEstado> HistorialEstados => Set<HistorialEstado>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Apellido).HasMaxLength(150).IsRequired();
            e.Property(x => x.Email).HasMaxLength(320).IsRequired();
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Password).HasMaxLength(500).IsRequired();
            e.HasOne(x => x.Rol)
                .WithMany()
                .HasForeignKey(x => x.IdRol)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<Rol>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Nombre).HasMaxLength(100).IsRequired();
            e.Property(x => x.Permisos).HasMaxLength(2000).IsRequired();
        });
        modelBuilder.Entity<Categoria>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Nombre).HasMaxLength(100).IsRequired();
            e.Property(x => x.Descr).HasMaxLength(1000).IsRequired();
        });
        modelBuilder.Entity<Estado>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Valor)
                .HasConversion(
                    value =>
                        value == EstadoValor.EnProceso ? "En proceso"
                        : value == EstadoValor.Resuelto ? "Resuelto"
                        : "Sin resolver",
                    value =>
                        value == "En proceso" ? EstadoValor.EnProceso
                        : value == "Resuelto" ? EstadoValor.Resuelto
                        : EstadoValor.SinResolver
                )
                .HasMaxLength(30)
                .IsRequired();
        });
        modelBuilder.Entity<Incidencia>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Direccion).HasMaxLength(300).IsRequired();
            e.Property(x => x.FotoUrl).HasMaxLength(1000);
            e.Property(x => x.Titulo).HasMaxLength(200).IsRequired();
            e.Property(x => x.Descr).HasMaxLength(2000).IsRequired();
            e.HasOne(x => x.Estado)
                .WithMany(x => x.Incidencias)
                .HasForeignKey(x => x.IdEstado)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Categoria)
                .WithMany(x => x.Incidencias)
                .HasForeignKey(x => x.IdCategoria)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Usuario)
                .WithMany(x => x.Incidencias)
                .HasForeignKey(x => x.IdUsuario)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<HistorialEstado>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Comentario).HasMaxLength(2000).IsRequired();
            e.HasOne(x => x.Usuario)
                .WithMany(x => x.HistorialEstados)
                .HasForeignKey(x => x.IdUsuario)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Estado)
                .WithMany(x => x.HistorialEstados)
                .HasForeignKey(x => x.IdEstado)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Incidencia)
                .WithMany(x => x.HistorialEstados)
                .HasForeignKey(x => x.IdIncidencia)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
