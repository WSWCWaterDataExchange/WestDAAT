using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Engines
{
    public abstract class EngineBase : ServiceContractBase
    {
        protected EngineBase(ILogger logger)
        {
            base.Logger = logger;
        }
    }
}
