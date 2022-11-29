using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        }
    }
}