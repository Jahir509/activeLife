using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
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
    
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            Console.WriteLine(loginDto);
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if(user == null ) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user,loginDto.Password);

            if(result)
            {
                return CreateUserObject(user);
            }

            return Unauthorized();
        }


        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await _userManager.Users.AnyAsync(x=> x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("userName","Username is Already Taken");
                // return BadRequest(ModelState);
                return ValidationProblem();
            }
            if(await _userManager.Users.AnyAsync(x=> x.Email == registerDto.Email))
            {
                 ModelState.AddModelError("enauk","Email is Already Taken");
                // return BadRequest(ModelState);
                return ValidationProblem();
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
                return CreateUserObject(user);
            }

            return BadRequest("Problem registering user");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(AppUser user)
        {
                return new UserDto
                {
                    UserName = user.UserName,
                    DisplayName = user.DisplayName,
                    Token = _tokenService.CreateToken(user),
                    Image = null
                };
        }
    }
}