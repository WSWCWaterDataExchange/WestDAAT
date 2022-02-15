using Microsoft.Extensions.Configuration;
using System;

namespace WesternStatesWater.WaDE.Common
{
    public static class Config
    {
        public static string SqlServerConnectionString => GetConfigValue("ConnectionStrings:WaDEDatabase");

        public static string CorsOrigin => GetConfigValue("AppSettings:CorsOrigin");

        public static string AccessTokenDatabaseResource => GetConfigValue("AppSettings:AccessTokenDatabaseResource");
        public static string AccessTokenDatabaseTenantId => GetConfigValue("AppSettings:AccessTokenDatabaseTenantId");

        static IConfiguration _cachedConfig;
        private static IConfiguration Configuration
        {
            get
            {
                if (_cachedConfig == null)
                {
                    var builder = new ConfigurationBuilder()
                        .AddJsonFile("appsettings.json", true, true)
                        .AddJsonFile($"appsettings.Development.json", true, true)
                        .AddJsonFile($"appsettings.{Environment.UserName}.json", true, true)
                        .AddEnvironmentVariables();
                    _cachedConfig = builder.Build();
                }

                return _cachedConfig;
            }
        }

        private static string GetConfigValue(string environmentVariable)
        {
            var result = Configuration[environmentVariable];
            return result;
        }
    }
}
