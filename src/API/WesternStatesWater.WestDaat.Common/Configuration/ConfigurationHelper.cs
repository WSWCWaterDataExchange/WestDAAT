using Microsoft.Extensions.Configuration;

namespace WesternStatesWater.WestDaat.Common.Configuration
{
    public static class ConfigurationHelper
    {
        public static Dictionary<string, string> DefaultConfiguration => new Dictionary<string, string>
            {
                { "Values:AzureWebJobsStorage", "UseDevelopmentStorage=true" },
                { $"{ConfigurationRootNames.Database}:{nameof(DatabaseConfiguration.ConnectionString)}", "Server=.;Initial Catalog=WaDE2;Integrated Security=true;" },
                { $"{ConfigurationRootNames.UsgsNldiService}:{nameof(UsgsNldiServiceConfiguration.BaseAddress)}", "https://labs.waterdata.usgs.gov/api/nldi/" },
                { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxUpstreamMainDistance)}", "50" },
                { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxUpstreamTributaryDistance)}", "50" },
                { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxDownstreamMainDistance)}", "50" },
                { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxDownstreamDiversionDistance)}", "50" }

            };

        public static DatabaseConfiguration GetDatabaseConfiguration(this IConfiguration config)
        {
            return config.GetSection(ConfigurationRootNames.Database).Get<DatabaseConfiguration>();
        }

        public static UsgsNldiServiceConfiguration GetUsgsNldiServiceConfiguration(this IConfiguration config)
        {
            return config.GetSection(ConfigurationRootNames.UsgsNldiService).Get<UsgsNldiServiceConfiguration>();
        }

        public static NldiConfiguration GetNldiConfiguration(this IConfiguration config)
        {
            return config.GetSection(ConfigurationRootNames.Nldi).Get<NldiConfiguration>();
        }
    }

    public static class ConfigurationRootNames
    {
        public const string Database = "Database";
        public const string UsgsNldiService = "UsgsNldiService";
        public const string Nldi = "Nldi";
    }
}
