using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Attendances
{
    public class UpdateAttendance
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context=context;
                _userAccessor=userAccessor;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(a=>a.Attendees)
                    .ThenInclude(u=> u.AppUser)
                    .SingleOrDefaultAsync(x=>x.Id == request.Id);
                
                if(activity == null)
                {
                    return null;
                }

                // extract the user from the request token via _userAccessor
                // and find in User and set to `user` variable
                // request User
                var user = await _context.Users.FirstOrDefaultAsync(x=>x.UserName == _userAccessor.GetUserName());

                if(user == null) return null;

                // find host user's username from activity
                var hostUserName = activity.Attendees.FirstOrDefault(x=>x.IsHost).AppUser.UserName;

                // get & check the request user is already on attendees list or not
                var attendance = activity.Attendees.FirstOrDefault(x=> x.AppUser.UserName == user.UserName);

                if(attendance != null && hostUserName == user.UserName)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }

                if(attendance != null && hostUserName != user.UserName)
                {
                    activity.Attendees.Remove(attendance);
                }

                if(attendance == null)
                {
                   attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendee");

            }
        }
    }
}