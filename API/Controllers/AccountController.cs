using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if(user == null ) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user,loginDto.Password);

            if(result)
            {
                return new UserDto{
                    DisplayName = user.DisplayName,
                    Image = null,
                    Token = _tokenService.CreateToken(user),
                    UserName = user.UserName,
                };
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await _userManager.Users.AnyAsync(x=> x.UserName == registerDto.UserName))
            {
                return BadRequest("Username is Already Taken");
            }
            if(await _userManager.Users.AnyAsync(x=> x.Email == registerDto.Email))
            {
                return BadRequest("Username is Already Taken");
            }
            
            var user = new AppUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName
            };

            var result = await _userManager.CreateAsync(user,registerDto.Password);

            if(result.Succeeded)
            {
                return new UserDto
                {
                    UserName = user.UserName,
                    DisplayName = user.DisplayName,
                    Token = _tokenService.CreateToken(user),
                    Image = null
                };
            }

            return BadRequest("Problem registering user");
        }

    }
}