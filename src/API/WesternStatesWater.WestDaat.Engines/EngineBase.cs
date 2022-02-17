using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common;
using Microsoft.Extensions.Logging;

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
