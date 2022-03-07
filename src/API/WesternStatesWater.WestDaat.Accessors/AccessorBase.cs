using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Accessors
{
    public abstract class AccessorBase : ServiceContractBase
    {
        protected AccessorBase(ILogger logger)
        {
            base.Logger = logger;
        }
    }
}
