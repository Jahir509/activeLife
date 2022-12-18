using Application.core;
using Application.DTO;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query: IRequest<Result<List<ActivityDto>>>
        {            
            
        }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Eager Loading
                // var activityList = await _context.Activities
                //     .Include(x=> x.Attendees)
                //     .ThenInclude(x=>x.AppUser)
                //     .ToListAsync(cancellationToken);
                //  var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activityList);


                var activityList = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);
               
                return Result<List<ActivityDto>>.Success(activityList);
            }
        }
    }
}