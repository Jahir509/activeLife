using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileActivityList
    {
        public class Query: IRequest<Result<List<ProfileShowActivityDto>>>
        {
            public string UserName { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler: IRequestHandler<Query,Result<List<ProfileShowActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper,IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<List<ProfileShowActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                    .Where(u=> u.AppUser.UserName == request.UserName)
                    .OrderByDescending(d=>d.Activity.Date)
                    .ProjectTo<ProfileShowActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                query = request.Predicate switch
                {
                    "past" => query.Where(a => a.Date <= DateTime.Now),
                    "hosting" => query.Where(a => a.HostUserName ==
                    request.UserName),
                    _ => query.Where(a => a.Date >= DateTime.Now)                
                };

                var activities = await query.ToListAsync();

                return Result<List<ProfileShowActivityDto>>.Success(activities);

            }
        }
    }
}