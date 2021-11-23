using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AuthenticationAPI.DTO
{
	public class ExternalAuthDto
	{
		public string Provider { get; set; }
		public string IdToken { get; set; }
	}
}
