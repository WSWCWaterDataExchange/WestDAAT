using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WaDE.Client.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public abstract class ApiControllerBase : ControllerBase
    {
        protected ApiControllerBase(ILogger logger)
        {
            Logger = logger;
        }

        public ILogger Logger { get; private set; }
    }
}