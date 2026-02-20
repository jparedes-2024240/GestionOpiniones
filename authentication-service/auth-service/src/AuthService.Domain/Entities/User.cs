using System;
using System.ComponentModel.DataAnnotations;
using AuthService.Domain.Enums;

namespace AuthService.Domain.Entities;

public class User
{
    [Key]
    [MaxLength(16)]
    public string Id {get; set;} = string.Empty;

    [Required(ErrorMessage = "El nombre es necesario.")]
    [MaxLength(25, ErrorMessage ="El nombre no debe de tener más de 25 caracteres.")]
    public string Name {get; set;} = string.Empty;

    [Required(ErrorMessage = "El Apellido es necesario.")]
    [MaxLength(25, ErrorMessage ="El Apellido no debe de tener más de 25 caracteres.")]
    public string Surname {get; set;} = string.Empty;

    [Required(ErrorMessage = "El Username es necesario.")]
    [MaxLength(25, ErrorMessage ="El Username no debe de tener más de 25 caracteres.")]
    public string Username {get; set;} = string.Empty;

    [Required(ErrorMessage = "El Email es necesario.")]
    [MaxLength(150, ErrorMessage ="El Email no debe de tener más de 150 caracteres.")]
    [EmailAddress(ErrorMessage = "El formato del email no es valido")]
    public string Email {get; set;} = string.Empty;

    [Required(ErrorMessage = "La contraseña es necesaria.")]
    [MaxLength(50, ErrorMessage ="La contraseña no debe de tener más de 50 caracteres.")]
    [MinLength(8, ErrorMessage = "La contraseña no debe de tener menos de 8 caracteres.")]
    public string Password {get; set;} = string.Empty;

    public bool Status {get; set;} = false;

    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;

    public UserProfile UserProfile {get; set;} = null!;

    public ICollection<UserRole> UserRoles {get; set;} = [];

    public UserToken UserToken {get; set;} = null!;
}
