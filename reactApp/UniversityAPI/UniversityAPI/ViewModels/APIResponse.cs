using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UniversityAPI.ViewModels
{
    public class APIResponse
    {
        public int ResponseCode { get; set; }
        public string ResponseMessage { get; set; }
        public string ResponseError { get; set; }

    }
}
