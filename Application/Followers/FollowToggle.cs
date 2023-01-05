using Application.core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string TargetUserName{ get; set; }
        }

        public class Handler: IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context,IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // the person who want to follow
                var observer = await _context.Users.FirstOrDefaultAsync(x=>
                    x.UserName == _userAccessor.GetUserName());

                // the person will be followed
                var target = await _context.Users.FirstOrDefaultAsync(x=>
                    x.UserName == request.TargetUserName );

                if(target == null) return null;

                var following = await _context.UserFollowings.FindAsync(observer.Id,target.Id);

                if(following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    _context.UserFollowings.Add(following);
                }

                else 
                {
                    _context.UserFollowings.Remove(following);
                }

                var succss = await _context.SaveChangesAsync() > 0;

                if(succss) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}