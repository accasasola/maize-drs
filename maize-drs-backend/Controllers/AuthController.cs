using Microsoft.AspNetCore.Mvc;
using maize_drs_backend.DTOs;
using maize_drs_backend.Models;
using maize_drs_backend.Services;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace maize_drs_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMongoCollection<ApplicationUser> _users;
        private readonly JwtService _jwtService;

        public AuthController(MongoDbService mongoService, JwtService jwtService)
        {
            _users = mongoService.GetUserCollection();
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existingUser = await _users.Find(u => u.Email == dto.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                return BadRequest("Email already in use.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new ApplicationUser
            {
                Email = dto.Email,
                PasswordHash = hashedPassword
            };

            await _users.InsertOneAsync(user);

            var token = _jwtService.CreateJwtToken(user);

            return Ok(new AuthenticationResponseDto
            {
                Email = user.Email,
                Token = token,
                Role = "User"
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _users.Find(u => u.Email == dto.Email).FirstOrDefaultAsync();
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid credentials");
            }

            var token = _jwtService.CreateJwtToken(user);

            return Ok(new AuthenticationResponseDto
            {
                Email = user.Email,
                Token = token,
                Role = "User"
            });
        }
    }
}
