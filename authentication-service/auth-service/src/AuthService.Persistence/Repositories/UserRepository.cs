using System;
using AuthService.Application.Services;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;

public class UserRepository(ApplicationDbContext context) : IUserRepository
{
    public async Task<User> GetByIdAsync(string id)
    {
        var user = await context.Users
            .Include(u => u.UserProfile)
            .Include(u => u.UserToken)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id);
        return user ?? throw new InvalidOperationException($"User with id {id} not found.");
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await context.Users
            .Include(u => u.UserProfile)
            .Include(u => u.UserToken)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => EF.Functions.ILike(u.Email, email));
    }

    public async Task<User?> GetByUserAsync(string username)
    {
        return await context.Users
            .Include(u => u.UserProfile)
            .Include(u => u.UserToken)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => EF.Functions.ILike(u.Username, username));
    }

    public async Task<User?> GetByVerificationTokenAsync(string token)
    {
        return await context.Users
            .Include(u => u.UserProfile)
            .Include(u => u.UserToken)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.UserToken != null &&
                                    u.UserToken.VerificationToken == token &&
                                    u.UserToken.VerificationTokenExpiry > DateTime.UtcNow);
    }

    public async Task<User> CreateUserAsync(User user)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return await GetByIdAsync(user.Id);
    }

    public async Task<User> UpdateUserAsync(User user)
    {
        // Entity is already tracked from GetByIdAsync, just save changes
        await context.SaveChangesAsync();
        return await GetByIdAsync(user.Id);
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        var user = await GetByIdAsync(id);
        context.Users.Remove(user);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await context.Users
            .AnyAsync(u => EF.Functions.ILike(u.Email, email));
    }

    public async Task<bool> ExistsByUsernameAsync(string username)
    {
        return await context.Users
            .AnyAsync(u => EF.Functions.ILike(u.Username, username));
    }

    public async Task UpdateUserRoleAsync(string userId, string roleId)
    {
        // Remove existing user-role associations
        var existingRoles = await context.UserRoles
            .Where(ur => ur.UserId == userId)
            .ToListAsync();
        
        context.UserRoles.RemoveRange(existingRoles);

        // Add new user-role association with the existing role
        var newUserRole = new UserRole
        {
            Id = UuidGenerator.GenerateUserId(), // Generate ID for the UserRole entry (not the Role)
            UserId = userId,
            RoleId = roleId, // Use the existing role ID from the roles table
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        context.UserRoles.Add(newUserRole);
        await context.SaveChangesAsync();
    }
}