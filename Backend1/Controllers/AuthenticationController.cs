using Asp.Versioning;
using Backend1.Data;
using Backend1.Dtos.Auth;
using Backend1.Models;
using Backend1.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Backend1.Controllers
{
    [Route("api/v{version:apiVersion}/auth")] // Supports versioning in URL
    [ApiController]
    [ApiVersion("1.0")]  
    public class AuthenticationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _config;

        public AuthenticationController(AppDbContext context, ITokenService tokenService, IConfiguration config)
        {
            _context = context;
            _tokenService = tokenService;
            _config = config;
        }

        //Login for Student, Tutor, or Staff
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            string role = "";
            int userId = 0;
            string email = "";
            string username = "";
            int accountId = 0;

            var student = await _context.Students.FirstOrDefaultAsync(s => s.Email == dto.Email);
            if (student != null && VerifyPassword(dto.Password, student.Password))
            {
                role = "Student";
                userId = student.StudentID;
                email = student.Email;
                username = student.Name;
            }

            var tutor = await _context.Tutors.FirstOrDefaultAsync(t => t.Email == dto.Email);
            if (tutor != null && VerifyPassword(dto.Password, tutor.Password))
            {
                role = "Tutor";
                userId = tutor.TutorID;
                email = tutor.Email;
                username = tutor.Name;
            }

            var staff = await _context.Staffs.FirstOrDefaultAsync(s => s.Email == dto.Email);
            if (staff != null && VerifyPassword(dto.Password, staff.Password))
            {
                role = "Staff";
                userId = staff.StaffID;
                email = staff.Email;
                username = staff.Name;
            }

            if (string.IsNullOrEmpty(role))
            {
                return Unauthorized(new { Message = "Invalid credentials" });
            }

            var token = _tokenService.GenerateToken(userId, email, role);

            // Check the accounts in table
            var existingAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == email);
            if (existingAccount == null)
            {
                var newAccount = new Account
                {
                    Username = username,
                    Email = email,
                    Password = HashPassword(dto.Password), // HashPassword
                    StudentID = role == "Student" ? userId : null,
                    TutorID = role == "Tutor" ? userId : null,
                    StaffID = role == "Staff" ? userId : null
                };

                _context.Accounts.Add(newAccount);
                await _context.SaveChangesAsync();
                accountId = newAccount.AccountID;
            }
            else
            {
                accountId = existingAccount.AccountID;
            }

            return Ok(new
            {
                Message = "Login successful",
                Token = token,
                AccountID = accountId,
                Username = username,
                Email = email,
                Role = role,
                ProfileUrl = $"http://localhost:8008/api/v1/{role.ToLower()}s/{userId}"
            });
        }

        // Password Hashing
        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }

        // Verify Password
        private static bool VerifyPassword(string inputPassword, string storedHash)
        {
            return HashPassword(inputPassword) == storedHash;
        }
    }
}
