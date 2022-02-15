using WesternStatesWater.WaDE.Accessors;
using WesternStatesWater.WaDE.Common;
using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WaDE.Engines
{
    public abstract class EngineBase : ServiceContractBase
    {
        protected EngineBase(ILogger logger)
        {
            base.Logger = logger;
        }
    }
}
