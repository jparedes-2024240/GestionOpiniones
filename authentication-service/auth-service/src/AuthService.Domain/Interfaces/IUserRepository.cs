using System;
using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IUserRepository
{
    Task<User> CreateUserAsync(User user);
    Task<User> GetByIdAsync(string id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUserAsync(string username);
    Task<User?> GetByVerificationTokenAsync (string token);
    Task<bool> ExistsByEmailAsync(string email);
    Task<bool> ExistsByUsernameAsync (string username);
    Task<User> UpdateUserAsync (User user);
    Task<bool> DeleteUserAsync (string id);
    Task UpdateUserRoleAsync (string userdId, string roleId);
}
