
using AuthenticationAPI.Authentication;
using AuthenticationAPI.DTO;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationAPI.Handler
{
	public class ExternalAuthHandler
	{
		private readonly IConfiguration _configuration;
		private readonly IConfigurationSection _jwtSettings;
		private readonly IConfigurationSection _goolgeSettings;
		private readonly UserManager<ApplicationUser> _userManager;
		
		// ok
		public ExternalAuthHandler(IConfiguration configuration, UserManager<ApplicationUser> userManager)
		{
			_userManager = userManager;
			_configuration = configuration;
			_jwtSettings = _configuration.GetSection("JwtSettings");
			_goolgeSettings = _configuration.GetSection("GoogleAuthSettings");
		}

	
		// ok
		public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(ExternalAuthDto externalAuth)
		{
			try
			{
				var settings = new GoogleJsonWebSignature.ValidationSettings()
				{
					Audience = new List<string>() { _goolgeSettings.GetSection("clientId").Value }
				};

				var payload = await GoogleJsonWebSignature.ValidateAsync(externalAuth.IdToken, settings);
				return payload;
			}
			catch (Exception ex)
			{
				//log an exception
				return null;
			}
		}
	}
}
