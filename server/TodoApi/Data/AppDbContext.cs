using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data;


public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Todo> Todos => Set<Todo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Todo>(todo =>
        {
            todo.Property(t => t.Title).IsRequired().HasMaxLength(Todo.TitleMaxLength);
            todo.Property(t => t.Description).HasMaxLength(Todo.DescriptionMaxLength);
        });
    }
}
