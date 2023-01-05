using Application.core;
using Application.DTO;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query: IRequest<Result<PagedList<ActivityDto>>>
        {            
            public PagingParams Params { get; set; }   
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
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

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Eager Loading
                // var activityList = await _context.Activities
                //     .Include(x=> x.Attendees)
                //     .ThenInclude(x=>x.AppUser)
                //     .ToListAsync(cancellationToken);
                //  var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activityList);


                var query = _context.Activities
                    .OrderBy(d=>d.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                        new {currentUsername = _userAccessor.GetUserName()})
                    .AsQueryable();

                // getting Queryable data from database
                var activityList = await PagedList<ActivityDto>.CreateAsync(query,request.Params.PageNumber,request.Params.PageSize);

                return Result<PagedList<ActivityDto>>.Success(activityList);
            }
        }
    }
}