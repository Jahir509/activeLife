using API.Extensions;
using API.Middleware;
using API.SignalR;
using Application.Activities;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers(opt=>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            });
            services.AddControllers().AddFluentValidation(config=> 
            {
                config.RegisterValidatorsFromAssemblyContaining<Create>();
            });
            services.AddApplicationServices(_config);
            services.AddIdentityServices(_config);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // Middleware 
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            app.UseMiddleware<ExceptionMiddleware>();
            
            // This middleware for mime sniffing
            app.UseXContentTypeOptions();
            // this middleware is to restrict the information needed for the browser
            app.UseReferrerPolicy(opt=> opt.NoReferrer());
            // This middleware add xss protection header to prevent xss attack
            app.UseXXssProtection(opt=> opt.EnabledWithBlockMode());
            // This middleware prevent using our application in an iframe ( Click Jacking )
            app.UseXfo(opt=> opt.Deny());
            // This middleware whitesource our content and prevent main defence agains xss attack
            app.UseCsp(opt=> opt
                .BlockAllMixedContent()                      // only and only loads Https content
                .StyleSources(source=> source.Self().CustomSources("https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css","https://fonts.googleapis.com"))        // loads stylesheets only from our domain / approved source -wwwroot
                .FontSources(source=> source.Self().CustomSources("https://fonts.gstatic.com","https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/themes/default/assets/fonts/","data:"))         // only and only loads fonts from our domain -wwwroot
                .FormActions(source=> source.Self())         // only and only loads Form content from our domain -wwwroot
                .FrameAncestors(source=> source.Self())      // only and only loads Frame content from our domain -wwwroot
                .ImageSources(source=> source.Self().CustomSources("blob:","https://res.cloudinary.com"))        // only and only loads Image content from our domain -wwwroot
                .ScriptSources(source=> source.Self())       // only and only loads Script content from our domain -wwwroot 

            );

            if (env.IsDevelopment())
            {
            //    app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }
            else{
                app.Use(async(context,next)=>
                {
                    context.Response.Headers.Add("Strict-Transport-Security","max-age=31536000");
                    await next.Invoke();
                });
            }

            //app.UseHttpsRedirection();

            // This two middleware use to serve default static files in kestrel server
            app.UseDefaultFiles();
            app.UseStaticFiles();
            
            app.UseRouting();

            app.UseCors("CorsPolicy"); 

            app.UseAuthentication();

            app.UseAuthorization();



            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
                endpoints.MapFallbackToController("Index","FallBack");
            });
        }
    }
}
