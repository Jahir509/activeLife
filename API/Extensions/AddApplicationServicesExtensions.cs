using Application.Activities;
using Application.core;
using Application.Interfaces;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
    public static class AddApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,IConfiguration _config)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });

            services.AddDbContext<DataContext>(option=>{
                option.UseSqlite(_config.GetConnectionString("DefaultConnection"));
            });

            services.AddCors(option=>{
                option.AddPolicy("CorsPolicy",policy=>{
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithOrigins("http://localhost:3000"); 
                });
            });

            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfile).Assembly);

            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor,UserAccessor>();
            services.AddScoped<IPhotoAccessor,PhotoAccessor>();

            services.Configure<CloudinarySettings>(_config.GetSection("Cloudinary"));
            services.AddSignalR();


            return services;
        }
    }
}