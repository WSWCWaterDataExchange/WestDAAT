using System;
using WesternStatesWater.WaDE.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WaDE.Accessors
{
    public abstract class AccessorBase : ServiceContractBase
    {
        protected AccessorBase(ILogger logger)
        {
            base.Logger = logger;
        }
        
        internal T UsingDatabaseContext<T>(Func<EntityFramework.DatabaseContext, T> func)
        {
            using var db = new EntityFramework.DatabaseContext();

            try
            {
                return func(db);
            }
            catch (Exception e)
            {
                Logger.LogError(e, "Error in Database Context");
                throw;
            }
        }
    }
}
