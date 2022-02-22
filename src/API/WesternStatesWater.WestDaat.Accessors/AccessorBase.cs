using System;
using WesternStatesWater.WestDaat.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Accessors
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
                Logger.LogError("Connection string: " + Config.SqlServerConnectionString);
                Logger.LogError("AccessTokenDatabaseTenantId: " + Config.AccessTokenDatabaseTenantId);
                Logger.LogError("AccessTokenDatabaseResource: " + Config.AccessTokenDatabaseResource);
                Logger.LogError("ShouldUseToken: " + DatabaseContext.ShouldUseAzureAccessTokenAuth());
                Logger.LogError("Token: " + DatabaseContext.GetAzureAccessToken());
                Logger.LogError(e, "Error in Database Context. " + e);
                throw;
            }
        }
    }
}
