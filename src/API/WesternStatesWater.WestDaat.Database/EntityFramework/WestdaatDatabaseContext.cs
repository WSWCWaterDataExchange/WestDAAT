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
        public virtual DbSet<UserRole> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Organization>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("Organizations", "dbo");

                entity.Property(e => e.Id)
                    .HasColumnName(nameof(Organization.Id))
                    .IsRequired();

                entity.Property(e => e.Name)
                    .HasColumnName(nameof(Organization.Name))
                    .IsRequired();

                entity.HasMany(e => e.UserOrganizations)
                    .WithOne(uo => uo.Organization)
                    .HasForeignKey(uo => uo.OrganizationId)
                    .HasConstraintName("FK_Organizations");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("Users", "dbo");

                entity.Property(e => e.Id)
                    .HasColumnName(nameof(User.Id))
                    .IsRequired();

                entity.Property(e => e.Email)
                    .HasColumnName(nameof(User.Email))
                    .IsRequired();

                entity.Property(e => e.ExternalAuthId)
                    .HasColumnName(nameof(User.ExternalAuthId))
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasColumnName(nameof(User.CreatedAt))
                    .IsRequired();

                entity.HasMany(u => u.UserRoles)
                    .WithOne(ur => ur.User)
                    .HasForeignKey(ur => ur.UserId)
                    .HasConstraintName("FK_UserRoles_Users");

                entity.HasMany(u => u.UserOrganizations)
                    .WithOne(uo => uo.User)
                    .HasForeignKey(uo => uo.UserId)
                    .HasConstraintName("FK_Users");
            });

            modelBuilder.Entity<UserOrganization>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("UserOrganizations", "dbo");

                entity.Property(e => e.Id)
                    .HasColumnName(nameof(UserOrganization.Id))
                    .IsRequired();

                entity.Property(e => e.UserId)
                    .HasColumnName(nameof(UserOrganization.UserId))
                    .IsRequired();

                entity.Property(e => e.OrganizationId)
                    .HasColumnName(nameof(UserOrganization.OrganizationId))
                    .IsRequired();
            });

            modelBuilder.Entity<UserOrganizationRole>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("UserOrganizationRoles", "dbo");

                entity.Property(e => e.Id)
                    .HasColumnName(nameof(UserOrganizationRole.Id))
                    .IsRequired();

                entity.Property(e => e.UserOrganizationId)
                    .HasColumnName(nameof(UserOrganizationRole.UserOrganizationId))
                    .IsRequired();

                entity.Property(e => e.Role)
                    .HasColumnName(nameof(UserOrganizationRole.Role))
                    .IsRequired();
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.ToTable("UserRoles", "dbo");

                entity.Property(e => e.Id)
                    .HasColumnName(nameof(UserRole.Id))
                    .IsRequired();

                entity.Property(e => e.UserId)
                    .HasColumnName(nameof(UserRole.UserId))
                    .IsRequired();

                entity.Property(e => e.Role)
                    .HasColumnName(nameof(UserRole.Role))
                    .IsRequired();
            });
        }
    }
}