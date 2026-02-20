using System;
using System.Runtime.CompilerServices;
using AuthService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users {get; set;}
    public DbSet<Role> Roles {get; set;}
    public DbSet<UserRole> UserRoles {get; set;}
    public DbSet<UserProfile> UserProfiles {get; set;}
    public DbSet<UserToken> UserTokens {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        //Aplicar snake case a tablas y columnas
        foreach(var entity in modelBuilder.Model.GetEntityTypes())
        {   
            //tabla snake case
            var tablename = entity.GetTableName();
            if(!string.IsNullOrEmpty(tablename))
            {
                entity.SetTableName(ToSnakeCase(tablename));
            }

            //columnas snake case
            foreach(var property in entity.GetProperties())
            {
                var columnName = property.GetColumnName();
                if(!string.IsNullOrEmpty(columnName))
                {
                    property.SetColumnName(ToSnakeCase(columnName));
                }
            }

            //foreign keys snake case
            foreach(var key in entity.GetKeys())
            {
                var KeyName = key.GetName();
                if(!string.IsNullOrEmpty(KeyName))
                {
                    key.SetName(ToSnakeCase(KeyName));
                }
            }

            //indexes snake case
            foreach(var index in entity.GetIndexes())
            {
                var indexName = index.GetDatabaseName();
                if(!string.IsNullOrEmpty(indexName))
                {
                    index.SetDatabaseName(ToSnakeCase(indexName));
                }
            }
        }

        modelBuilder.Entity<User>(Entity =>
        {
            Entity.HasKey(e => e.Id);
            Entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            Entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(25);
            Entity.Property(e => e.Surname)
                .IsRequired()
                .HasMaxLength(25);
            Entity.Property(e => e.Username)
                .IsRequired();
            Entity.Property(e => e.Email)
                .IsRequired();
            Entity.Property(e => e.Password)
                .IsRequired()
                .HasMaxLength(255);
            Entity.Property(e => e.Status)
                .HasDefaultValue(false);
            Entity.Property(e => e.CreatedAt)
                .IsRequired();
            Entity.Property(e => e.UpdatedAt)
                .IsRequired();
            //Indices para optimizacion de busqueda
            Entity.HasIndex(e => e.Username).IsUnique();
            Entity.HasIndex(e => e.Email).IsUnique();
            //Relaciones
            Entity.HasOne(e => e.UserProfile)
                .WithOne(p => p.User)
                .HasForeignKey<UserProfile>(p => p.UserId);
            Entity.HasMany(e => e.UserRoles)
                .WithOne(ur => ur.User)
                .HasForeignKey(ur => ur.UserId);
            Entity.HasOne(e => e.UserToken)
                .WithOne(ut => ut.User)
                .HasForeignKey<UserToken>(ut => ut.UserId);
        });

        // Configuración de UserProfile
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.UserId)
                .HasMaxLength(16);
            entity.Property(e => e.Phone).HasMaxLength(8);
        });
 
        // Configuración de Role
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.CreatedAt)
                .IsRequired();
            entity.Property(e => e.UpdatedAt)
                .IsRequired();
        });
 
        // Configuración de UserRole
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.UserId)
                .HasMaxLength(16);
            entity.Property(e => e.RoleId)
                .HasMaxLength(16);
            entity.Property(e => e.CreatedAt)
                .IsRequired();
            entity.Property(e => e.UpdatedAt)
                .IsRequired();
            entity.HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);
            entity.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);
        });
 
        // Configuración de UserToken
        modelBuilder.Entity<UserToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.UserId)
                .HasMaxLength(16);
            entity.Property(e => e.IsVerified).HasDefaultValue(false);
            entity.Property(e => e.VerificationToken).HasMaxLength(256);
        });
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => (e.Entity is User || e.Entity is Role || e.Entity is UserRole)
            && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach(var entry in entries)
        {
            if(entry.Entity is User user)
            {
                if(entry.State == EntityState.Added)
                {
                    user.CreatedAt = DateTime.UtcNow;
                }
                user.UpdatedAt = DateTime.UtcNow;
            }
            else if(entry.Entity is Role role)
            {
                if(entry.State == EntityState.Added)
                {
                    role.CreatedAt = DateTime.UtcNow;
                }
                role.UpdatedAt = DateTime.UtcNow;
            }
            else if(entry.Entity is UserRole userRole)
            {
                if(entry.State == EntityState.Added)
                {
                    userRole.CreatedAt = DateTime.UtcNow;
                }
                userRole.UpdatedAt = DateTime.UtcNow;
            }
        }
    }

    private static string ToSnakeCase(string input)
    {
        if(string.IsNullOrEmpty(input))
            return input;

        return string.Concat(
            input.Select((c, i) => i > 0 && char.IsUpper(c)? "_" + c : c.ToString())
        ).ToLower();
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }
}