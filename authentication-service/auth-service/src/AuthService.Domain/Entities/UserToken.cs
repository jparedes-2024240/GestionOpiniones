using System;
using System.ComponentModel.DataAnnotations;
using System.Dynamic;

namespace AuthService.Domain.Entities;

public class UserToken
{
    [Key]
    [MaxLength(16)]
    public string Id {get; set;} = string.Empty;

    [Required]
    [MaxLength(16)]
    public string UserId {get; set;} = string.Empty;

    [Required]
    public bool IsVerified {get; set;} = false;

    public string? VerificationToken {get; set;} 

    public DateTime? VerificationTokenExpiry {get; set;}

    public User User {get; set;} = null!;
}