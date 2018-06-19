using IEvangelist.PhotoBooth.Configuration;
using IEvangelist.PhotoBooth.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;

namespace IEvangelist.PhotoBooth
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
            => Configuration = configuration;

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Info { Title = "IEvangelist Photo Booth", Version = "v1" });
            });
            services.AddCors();

            // Map services
            services.AddTransient<IImageProcessorService, ImageProcessorService>();
            services.AddSingleton<IImageRepository, ImageRepository>();
            services.AddSingleton<ITextMessagingService, TextMessagingService>();

            // Map appsettings.json to class options
            services.Configure<ImageProcessingOptions>(Configuration.GetSection(nameof(ImageProcessingOptions)));
            services.Configure<ImageCaptureOptions>(Configuration.GetSection(nameof(ImageCaptureOptions)));
            services.Configure<ImageRepositoryOptions>(Configuration.GetSection(nameof(ImageRepositoryOptions)));
            services.Configure<TwilioOptions>(Configuration.GetSection(nameof(TwilioOptions)));

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection()
               .UseStaticFiles()
               .UseSpaStaticFiles();

            app.UseCors(builder =>
               {
                   builder.WithOrigins("http://localhost")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowAnyOrigin()
                          .AllowCredentials();
               })
            .UseMvc(routes =>
               {
                   routes.MapRoute(
                       name: "default",
                       template: "{controller}/{action=Index}/{id?}");
               });

            app.UseSwagger()
               .UseSwaggerUI(c =>
               {
                   c.SwaggerEndpoint("/swagger/v1/swagger.json", "IEvangelist Photo Booth");
               })
               .UseSpa(spa =>
               {
                   // To learn more about options for serving an Angular SPA from ASP.NET Core,
                   // see https://go.microsoft.com/fwlink/?linkid=864501

                   spa.Options.SourcePath = "ClientApp";                   
                   if (env.IsDevelopment())
                   {
                       spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                       //spa.UseAngularCliServer(npmScript: "start");
                   }
               });
        }
    }
}