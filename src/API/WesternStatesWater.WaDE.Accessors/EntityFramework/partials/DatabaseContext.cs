using System;
using System.Diagnostics.CodeAnalysis;
using WesternStatesWater.WaDE.Common;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace WesternStatesWater.WaDE.Accessors.EntityFramework
{
    public partial class DatabaseContext : DbContext
    {
        [SuppressMessage("Microsoft.Design", "CA2000", Justification = "DbContext has its own using statement")]
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            if (!optionsBuilder.IsConfigured)
            {
                if (ShouldUseAzureAccessTokenAuth())
                {
                    var connection = new SqlConnection();
                    connection.ConnectionString = Config.SqlServerConnectionString;
                    connection.AccessToken = GetAzureAccessToken();
                    optionsBuilder.UseSqlServer(connection);
                }
                else
                {
                    optionsBuilder.UseSqlServer(Config.SqlServerConnectionString);
                }
            }
        }

        public static string GetAzureAccessToken()
        {
            var accessToken = new AzureServiceTokenProvider().GetAccessTokenAsync(
                Config.AccessTokenDatabaseResource,
                Config.AccessTokenDatabaseTenantId
            ).Result;

            return accessToken;
        }

        public static bool ShouldUseAzureAccessTokenAuth()
        {
            // If a password is supplied, use sql auth, otherwise use AD Auth
            var containsPassword = Config.SqlServerConnectionString.Contains("password", StringComparison.InvariantCultureIgnoreCase) ||
               Config.SqlServerConnectionString.Contains("integrated security", StringComparison.InvariantCultureIgnoreCase);
            return !containsPassword;
        }

        public DbSet<Todo> Todos { get; set; }
    }
}
