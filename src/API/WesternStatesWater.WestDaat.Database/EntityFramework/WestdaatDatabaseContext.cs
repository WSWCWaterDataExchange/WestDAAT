using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class WestDaatDatabaseContext : DbContext
    {
        public WestDaatDatabaseContext(DatabaseConfiguration configuration)
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

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            var result = await base
                .SaveChangesAsync(cancellationToken)
                .ConfigureAwait(false);

            ChangeTracker.Clear();

            return result;
        }

        public override async Task<int> SaveChangesAsync(
            bool acceptAllChangesOnSuccess,
            CancellationToken cancellationToken = new CancellationToken())
        {
            var result = await base
                .SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken)
                .ConfigureAwait(false);

            ChangeTracker.Clear();

            return result;
        }

        public virtual DbSet<Organization> Organizations { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserOrganization> UserOrganizations { get; set; }
        public virtual DbSet<UserOrganizationRole> UserOrganizationRoles { get; set; }
        public virtual DbSet<UserProfile> UserProfiles { get; set; }
        public virtual DbSet<UserRole> UserRoles { get; set; }
        public virtual DbSet<WaterConservationApplication> WaterConservationApplications { get; set; }
        public virtual DbSet<WaterConservationApplicationEstimate> WaterConservationApplicationEstimates { get; set; }
        public virtual DbSet<WaterConservationApplicationEstimateLocation> WaterConservationApplicationEstimateLocations { get; set; }
        public virtual DbSet<WaterConservationApplicationEstimateLocationConsumptiveUse> WaterConservationApplicationEstimateLocationConsumptiveUses { get; set; }
        public virtual DbSet<WaterConservationApplicationSubmission> WaterConservationApplicationSubmissions { get; set; }
        public virtual DbSet<WaterConservationApplicationSubmissionNote> WaterConservationApplicationSubmissionNotes { get; set; }
        public virtual DbSet<WaterConservationApplicationDocument> WaterConservationApplicationDocuments { get; set; }
    }
}