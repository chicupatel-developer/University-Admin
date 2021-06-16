using AuthenticationAPI.Authentication;
using AuthenticationAPI.Handler;
using DataAccess.EFCore;
using DataAccess.EFCore.Repositories;
using Entities.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace UniversityAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            #region UniversityContext
            services.AddDbContext<UniversityContext>(options =>
                    options.UseSqlServer(
                      Configuration.GetConnectionString("DefaultConnection"),
                      b => b.MigrationsAssembly(typeof(UniversityContext).Assembly.FullName)));
            #endregion

            #region Repositories
            services.AddTransient<IDepartmentRepository, DepartmentRepository>();
            services.AddTransient<IFacultyRepository, FacultyRepository>();
            services.AddTransient<IAssignmentRepository, AssignmentRepository>();
            services.AddTransient<ICourseRepository, CourseRepository>();
            services.AddTransient<IStudentRepository, StudentRepository>();
            #endregion

            #region token configuration
            /////////////////// token configuration start //////////////////
            // authentication web api project
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("sqlConnection_authentication")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
                        
            // Adding Authentication  
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                
            // Adding Jwt Bearer  
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = Configuration["JWT:ValidAudience"],
                    ValidIssuer = Configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"]))
                };
            });

            //// role
            services.AddAuthorization(options =>
            {
                options.AddPolicy("Admin",
                    authBuilder =>
                    {
                        authBuilder.RequireRole("Admin");
                    });
                options.AddPolicy("User",
                    authBuilder =>
                    {
                        authBuilder.RequireRole("User");
                    });
                options.AddPolicy("Student",
                   authBuilder =>
                   {
                       authBuilder.RequireRole("Student");
                   });

            });

            /////////////////// token configuration end //////////////////
            #endregion

            #region google authentication and services
            ////// google authentication and services start ////////////            
            services.AddAuthentication()
                .AddGoogle(opts =>
                {
                    opts.ClientId = "540442470157-4o0u4lr88bicssg4e9rtjikanuckq73t.apps.googleusercontent.com";
                    opts.ClientSecret = "YWwiwL9dpUXh6MLxL2jEK8Q9";
                    opts.SignInScheme = IdentityConstants.ExternalScheme;
                });
            // this handler varify google token
            // later AuthenticateController generates token and return to client
            services.AddScoped<ExternalAuthHandler>();
            ////// google authentication and services end ////////////
            #endregion

            #region cors
            // cors
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });
            #endregion

            #region upload
            // upload
            services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });
            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("CorsPolicy");

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
