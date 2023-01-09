using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Comments;
using Application.DTO;
using AutoMapper;
using Domain;

namespace Application.core
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {

            //this for boolean following options
            string currentUsername = null;

            //CreateMap< {from}, {to} >()
            //CreateMap<Activity,Activity>();

            CreateMap<Activity,ActivityDto>()
                .ForMember(destination=> destination.HostUserName,o=> o.MapFrom(source=> source.Attendees
                    .FirstOrDefault(x=> x.IsHost).AppUser.UserName));

            CreateMap<Activity,ProfileShowActivityDto>()
                .ForMember(destination=> destination.HostUserName,o=> o.MapFrom(source=> source.Attendees
                    .FirstOrDefault(user=> user.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee,AttendeeDto>()
                .ForMember(destination=> destination.DisplayName,o=>o.MapFrom(source=> source.AppUser.DisplayName))
                .ForMember(destination=> destination.UserName,o=>o.MapFrom(source=> source.AppUser.UserName))
                .ForMember(destination=> destination.Bio,o=>o.MapFrom(source=> source.AppUser.Bio))
                .ForMember(destination=> destination.Image,o=>o.MapFrom(source=> source.AppUser.Photos.FirstOrDefault(x=>x.IsMain).Url))
                .ForMember(destination=> destination.FollowersCount,o=> o.MapFrom(source=> source.AppUser.Followers.Count))
                .ForMember(destination=> destination.FollowingCount,o=> o.MapFrom(source=> source.AppUser.Followings.Count))
                .ForMember(destination=> destination.Following,
                        o=> o.MapFrom(source=> source.AppUser.Followers.Any(x=>x.Observer.UserName == currentUsername)));

            CreateMap<AppUser,Profiles.Profile>()
                .ForMember(destination=> destination.Image,o=>o.MapFrom(source=> source.Photos.FirstOrDefault(x=>x.IsMain).Url))
                .ForMember(destination=> destination.FollowersCount,o=> o.MapFrom(source=> source.Followers.Count))
                .ForMember(destination=> destination.FollowingCount,o=> o.MapFrom(source=> source.Followings.Count))
                .ForMember(destination=> destination.Following,
                        o=> o.MapFrom(source=> source.Followers.Any(x=>x.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));    
        }
    }
}