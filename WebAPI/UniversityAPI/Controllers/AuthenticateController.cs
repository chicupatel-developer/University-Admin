﻿using AuthenticationAPI.Authentication;  
using Microsoft.AspNetCore.Http;  
using Microsoft.AspNetCore.Identity;  
using Microsoft.AspNetCore.Mvc;  
using Microsoft.Extensions.Configuration;  
using Microsoft.IdentityModel.Tokens;  
using System;  
using System.Collections.Generic;  
using System.IdentityModel.Tokens.Jwt;  
using System.Security.Claims;  
using System.Text;  
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using AuthenticationAPI.DTO;
using AuthenticationAPI.Handler;
using UniversityAPI.ViewModels;
using Entities.Interfaces;

namespace UniversityAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        // updating StudentUserId column value of Student by Id column value of ApplicationUser
        private readonly IStudentRepository _stdRepo;

        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;

        // google
        private readonly ExternalAuthHandler _jwtHandler;

        private APIResponse _response;

        // ok
        public AuthenticateController(IStudentRepository stdRepo, ExternalAuthHandler jwtHandler, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
            _jwtHandler = jwtHandler;
            this._stdRepo = stdRepo;
        }

        // ok
        // local database sign in
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var response = new Response();

            try
            {
                // throw new Exception();

                if (ModelState.IsValid)
                {
                    var user = await userManager.FindByNameAsync(model.Username);
                    if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
                    {
                        var userRoles = await userManager.GetRolesAsync(user);

                        var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };

                        foreach (var userRole in userRoles)
                        {
                            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                        }

                        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                        var token = new JwtSecurityToken(
                            issuer: _configuration["JWT:ValidIssuer"],
                            audience: _configuration["JWT:ValidAudience"],
                            expires: DateTime.Now.AddHours(3),
                            // expires: DateTime.UtcNow.AddSeconds(8),
                            claims: authClaims,
                            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                            );

                        response.Status = "200";
                        response.Message = "Login Success!";

                        // Student
                        if (authClaims[2].Value == "Student")
                        {
                            // get student's info using Id and StudentUserId 
                            var std = _stdRepo.GetStudentLoginProcess(user.Id);
                            if (std != null)
                            {
                                return Ok(new
                                {
                                    response = response,
                                    token = new JwtSecurityTokenHandler().WriteToken(token),
                                    expiration = token.ValidTo,
                                    userName = model.Username,
                                    myRole = authClaims[2].Value,
                                    StudentId = std.StudentId,
                                    FirstName = std.FirstName,
                                    LastName = std.LastName
                                });
                            }
                            else
                            {
                                response.Status = "401";
                                response.Message = "Student Not Linked To App's User Account!";
                                return Ok(new
                                {
                                    response = response,
                                });
                            }
                        }
                        else
                        {
                            // Admin
                            return Ok(new
                            {
                                response = response,
                                token = new JwtSecurityTokenHandler().WriteToken(token),
                                expiration = token.ValidTo,
                                userName = model.Username,
                                myRole = authClaims[2].Value
                            });
                        }
                    }
                    else
                    {
                        response.Status = "401";
                        response.Message = "Username / Password Incorrect!";
                        return Ok(new
                        {
                            response = response,
                        });
                    }
                }
                else
                {
                    return BadRequest(ModelState);
                }             
            }
            catch(Exception ex)
            {
                response.Status = "500";
                response.Message = "Server Error!";
                return Ok(new
                {
                    response = response,
                });
            }
         
        }

        // ok
        // external user(google) has Admin role
        // select * from AspNetUserLogins
        [HttpPost("ExternalLogin")]
        public async Task<IActionResult> ExternalLogin([FromBody] ExternalAuthDto externalAuth)
        {
            try
            {
                // throw new Exception();

                var payload = await _jwtHandler.VerifyGoogleToken(externalAuth);
                if (payload == null)
                    // return BadRequest("Invalid External Authentication.");
                    return Ok(new AuthResponseDto { ErrorMessage = "Invalid External Authentication!" });


                var info = new UserLoginInfo(externalAuth.Provider, payload.Subject, externalAuth.Provider);
                var user = await userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
                if (user == null)
                {
                    user = await userManager.FindByEmailAsync(payload.Email);
                    if (user == null)
                    {
                        user = new ApplicationUser { Email = payload.Email, UserName = payload.Email };
                        await userManager.CreateAsync(user);

                        // error--- VIEWER role not exist
                        // db update exception
                        // await userManager.AddToRoleAsync(user, "Viewer");
                         
                        // external user has Admin role
                        await userManager.AddToRoleAsync(user, "Admin");

                        await userManager.AddLoginAsync(user, info);
                    }
                    else
                    {
                        // external user has User role only
                        await userManager.AddToRoleAsync(user, "User");

                        await userManager.AddLoginAsync(user, info);
                    }
                }
                if (user == null)
                    // return BadRequest("Invalid External Authentication.");
                    return Ok(new AuthResponseDto { ErrorMessage = "Invalid External Authentication!" });


                var userRoles = await userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }
                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
                var tokenObj = new JwtSecurityToken(
                                  issuer: _configuration["JWT:ValidIssuer"],
                                  audience: _configuration["JWT:ValidAudience"],
                                  expires: DateTime.Now.AddHours(3),
                                  // expires: DateTime.UtcNow.AddSeconds(8),
                                  claims: authClaims,
                                  signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                               );
                var token = new JwtSecurityTokenHandler().WriteToken(tokenObj);
                return Ok(new 
                    AuthResponseDto { 
                        ErrorMessage = "External Login Success!", 
                        Token = token, 
                        IsAuthSuccessful = true, 
                        UserName = user.UserName,
                        myRole = authClaims[2].Value
                }
                );
            }
            catch(Exception ex)
            {
                return Ok(new AuthResponseDto { ErrorMessage = "Server Error!"});
            }   
        }

        // ok
        /*
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();

                var userExists = await userManager.FindByNameAsync(model.Username);
                if (userExists != null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

                ApplicationUser user = new ApplicationUser()
                {
                    Email = model.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = model.Username
                };
                var result = await userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

                

                _response.ResponseCode = 0;
                _response.ResponseMessage = "User created successfully!";
                _response.ResponseError = null;
            }
            catch(Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error!";
                _response.ResponseError = ex.Message.ToString();
            }
            return Ok(_response);
        }
        */

        
        // ok
        /*
        [HttpPost]
        [Route("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            _response = new APIResponse();
            try
            {
                var userExists = await userManager.FindByNameAsync(model.Username);
                if (userExists != null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

                ApplicationUser user = new ApplicationUser()
                {
                    Email = model.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = model.Username
                };
                var result = await userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

                if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
                if (!await roleManager.RoleExistsAsync(UserRoles.User))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.User));

                if (await roleManager.RoleExistsAsync(UserRoles.Admin))
                {
                    await userManager.AddToRoleAsync(user, UserRoles.Admin);
                }

                _response.ResponseCode = 0;
                _response.ResponseMessage = "User created successfully!";
                _response.ResponseError = null;
            }
            catch(Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error!";
                _response.ResponseError = ex.Message.ToString();
            }
            return Ok(_response);
        }
        */

        // ok
        // registration with role
        [HttpPost]
        [Route("register/{myRole}")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model, string myRole)
        {
            _response = new APIResponse();
            try
            {
                // check for exception
                // throw new Exception();

                if (ModelState.IsValid)
                {
                    var userExists = await userManager.FindByNameAsync(model.Username);
                    if (userExists != null)
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

                    ApplicationUser user = new ApplicationUser()
                    {
                        Email = model.Email,
                        SecurityStamp = Guid.NewGuid().ToString(),
                        UserName = model.Username
                    };

                    var result = await userManager.CreateAsync(user, model.Password);
                    if (!result.Succeeded)
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

                    if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                        await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
                    if (!await roleManager.RoleExistsAsync(UserRoles.Student))
                        await roleManager.CreateAsync(new IdentityRole(UserRoles.Student));

                    await userManager.AddToRoleAsync(user, myRole);

                    // check if myRole==Student && studentId>0 then get recently created user's Id 
                    // and update Student db table where StudentId == studentId
                    // means, storing Id value of ApplicationUser to Student db table's StudentUserId column
                    if (myRole == "Student")
                    {
                        _stdRepo.ConnectApplicationUserToStudent(user.Id, model.StudentId);
                    }
                    else
                    {
                        // do nothing
                        // user is Admin role
                    }

                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "User created successfully!";
                    _response.ResponseError = null;
                }
                else
                {
                    return BadRequest(ModelState);
                }
             
            }
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error!";
                _response.ResponseError = ex.Message.ToString();
            }
            return Ok(_response);
        }
    }
}
