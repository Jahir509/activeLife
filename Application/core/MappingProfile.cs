using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTO;
using AutoMapper;
using Domain;

namespace Application.core
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {

            //CreateMap< {from}, {to} >()
            CreateMap<Activity,Activity>();

            CreateMap<Activity,ActivityDto>()
                .ForMember(d=>d.HostUserName,o=> o.MapFrom(s=>s.Attendees
                    .FirstOrDefault(x=> x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee,Profiles.Profile>()
                .ForMember(d=>d.DisplayName,o=>o.MapFrom(s=>s.AppUser.DisplayName))
                .ForMember(d=>d.UserName,o=>o.MapFrom(s=>s.AppUser.UserName))
                .ForMember(d=>d.Bio,o=>o.MapFrom(s=>s.AppUser.Bio));
        }
    }
}