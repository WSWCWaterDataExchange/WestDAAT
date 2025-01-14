using System.Diagnostics.CodeAnalysis;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class WestdaatDatabaseContext : DbContext
    {
        public WestdaatDatabaseContext(DatabaseConfiguration configuration)
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
                    connection.ConnectionString = _configuration.WestDaatConnectionString;
                    connection.AccessToken = GetAzureAccessToken();
                    optionsBuilder.UseSqlServer(connection, x => x.UseNetTopologySuite());
                }
                else
                {
                    optionsBuilder.UseSqlServer(_configuration.WestDaatConnectionString, x => x.UseNetTopologySuite());
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
            var containsPassword =
                _configuration.WestDaatConnectionString.Contains("password", StringComparison.InvariantCultureIgnoreCase) ||
                _configuration.WestDaatConnectionString.Contains("integrated security",
                    StringComparison.InvariantCultureIgnoreCase);
            return !containsPassword;
        }

        public virtual DbSet<Organization> Organizations { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserOrganization> UserOrganizations { get; set; }
        public virtual DbSet<UserOrganizationRole> UserOrganizationRoles { get; set; }
        public virtual DbSet<UserRole> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Organization>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("Organizations", "dbo");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("Users", "dbo");
            });

            modelBuilder.Entity<UserOrganization>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("UserOrganizations", "dbo");
            });

            modelBuilder.Entity<UserOrganizationRole>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("UserOrganizationRoles", "dbo");
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("UserRoles", "dbo");
            });
        }
    }
}