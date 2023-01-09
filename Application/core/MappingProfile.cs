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

           CreateMap<ActivityAttendee, Profiles.ProfileShowActivityDto>()
                .ForMember(destination => destination.Id, o => o.MapFrom(source => source.Activity.Id))
                .ForMember(destination => destination.Date, o => o.MapFrom(source => source.Activity.Date))
                .ForMember(destination => destination.Title, o => o.MapFrom(source => source.Activity.Title))
                .ForMember(destination => destination.Category, o => o.MapFrom(s =>
                    s.Activity.Category))
                .ForMember(destination => destination.HostUserName, o => o.MapFrom(s =>
                    s.Activity.Attendees.FirstOrDefault(x =>
                    x.IsHost).AppUser.UserName));
                


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
                .ForMember(destination => destination.Username, o => o.MapFrom(source => source.Author.UserName))
                .ForMember(destination => destination.DisplayName, o => o.MapFrom(source => source.Author.DisplayName))
                .ForMember(destination => destination.Image, o => o.MapFrom(source => source.Author.Photos.FirstOrDefault(x => x.IsMain).Url));    
        }
    }
}