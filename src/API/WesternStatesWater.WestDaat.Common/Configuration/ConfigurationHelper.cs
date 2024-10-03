using Microsoft.Extensions.Configuration;

namespace WesternStatesWater.WestDaat.Common.Configuration
{
    public static class ConfigurationHelper
    {
        public static Dictionary<string, string> DefaultConfiguration => new Dictionary<string, string>
            {
                { "Values:AzureWebJobsStorage", "UseDevelopmentStorage=true" },
                { $"{ConfigurationRootNames.Database}:{nameof(DatabaseConfiguration.ConnectionString)}", "Server=.;Initial Catalog=WaDE2; User=sa; Password=DevP@ssw0rd!; TrustServerCertificate=true;" },
                { $"{ConfigurationRootNames.UsgsNldiService}:{nameof(UsgsNldiServiceConfiguration.BaseAddress)}", "https://labs.waterdata.usgs.gov/api/nldi/" },
                { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxUpstreamMainDistance)}", "50" },
                { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxUpstreamTributaryDistance)}", "50" },
                { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxDownstreamMainDistance)}", "50" },
                { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxDownstreamDiversionDistance)}", "50" },
                { $"{ConfigurationRootNames.Performance}:{nameof(PerformanceConfiguration.WaterRightsSearchPageSize)}", "100" },
                { $"{ConfigurationRootNames.Performance}:{nameof(PerformanceConfiguration.MaxRecordsDownload)}", "100000" },
                { $"{ConfigurationRootNames.Performance}:{nameof(PerformanceConfiguration.DownloadCommandTimeout)}", "120"}
            };

        public static DatabaseConfiguration GetDatabaseConfiguration(this IConfiguration config)
        {
            return config.GetSection(ConfigurationRootNames.Database).Get<DatabaseConfiguration>() ?? new DatabaseConfiguration();
        }

        public static EmailServiceConfiguration GetSmtpConfiguration(this IConfiguration config)
        {
            return config.GetSection(ConfigurationRootNames.Smtp).Get<EmailServiceConfiguration>() ?? new EmailServiceConfiguration();
        }

        public static UsgsNldiServiceConfiguration GetUsgsNldiServiceConfiguration(this IConfiguration config)
        {
            return config.GetSection(ConfigurationRootNames.UsgsNldiService).Get<UsgsNldiServiceConfiguration>() ?? new UsgsNldiServiceConfiguration();
        }

        public static NldiConfiguration GetNldiConfiguration(this IConfiguration config)
        {
            return config.GetSection(ConfigurationRootNames.Nldi).Get<NldiConfiguration>() ?? new NldiConfiguration();
        }

        public static BlobStorageConfiguration GetBlobStorageConfiguration(this IConfiguration config)
        {
            return config.GetSection(ConfigurationRootNames.Blob).Get<BlobStorageConfiguration>() ?? new BlobStorageConfiguration();
        }
        public static PerformanceConfiguration GetPerformanceConfiguration(this IConfiguration config)
        {
            return config.GetSection(ConfigurationRootNames.Performance).Get<PerformanceConfiguration>() ?? new PerformanceConfiguration();
        }
    }

    public static class ConfigurationRootNames
    {
        public const string Database = "Database";
        public const string Smtp = "Smtp";
        public const string UsgsNldiService = "UsgsNldiService";
        public const string Nldi = "Nldi";
        public const string Blob = "BlobStorage";
        public const string Performance = "Performance";
    }
}
