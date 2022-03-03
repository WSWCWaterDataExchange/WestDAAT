using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics.CodeAnalysis;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class DatabaseContext : DbContext
    {
        public DatabaseContext(DatabaseConfiguration configuration)
        {
            _configuration = configuration;
        }

        private readonly DatabaseConfiguration _configuration;

        [SuppressMessage("Microsoft.Design", "CA2000", Justification = "DbContext has its own using statement")]
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            if (!optionsBuilder.IsConfigured)
            {
                if (ShouldUseAzureAccessTokenAuth())
                {
                    var connection = new SqlConnection();
                    connection.ConnectionString = _configuration.ConnectionString;
                    connection.AccessToken = GetAzureAccessToken();
                    optionsBuilder.UseSqlServer(connection);
                }
                else
                {
                    optionsBuilder.UseSqlServer(_configuration.ConnectionString);
                }
            }
        }

        public string GetAzureAccessToken()
        {
            var accessToken = new AzureServiceTokenProvider().GetAccessTokenAsync(
                _configuration.AccessTokenDatabaseResource,
                _configuration.AccessTokenDatabaseTenantId
            ).Result;

            return accessToken;
        }

        public bool ShouldUseAzureAccessTokenAuth()
        {
            // If a password is supplied, use sql auth, otherwise use AD Auth
            var containsPassword = _configuration.ConnectionString.Contains("password", StringComparison.InvariantCultureIgnoreCase) ||
               _configuration.ConnectionString.Contains("integrated security", StringComparison.InvariantCultureIgnoreCase);
            return !containsPassword;
        }

        // DbSets go here
        // public DbSet<Todo> Todos { get; set; }
    }
}
