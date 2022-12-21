using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers.Base;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            Console.WriteLine(username);
            return HandleResult(await Mediator.Send(new Details.Query { UserName = username }));
        }
    }
}