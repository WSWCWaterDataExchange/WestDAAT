using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Managers.Handlers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestCategory("Manager Tests")]
    public abstract class ManagerTestBase
    {
        private ILoggerFactory _loggerFactory;
        public static IConfiguration Configuration { get; private set; }

        public Mock<IManagerRequestHandlerResolver> ManagerRequestHandlerResolverMock { get; } =
            new(MockBehavior.Strict);

        static ManagerTestBase()
        {
            Configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(DefaultTestConfiguration)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("personal.settings.json", optional: true, reloadOnChange: true)
                .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
                .AddEnvironmentVariables()
                .Build();
        }

        public static Dictionary<string, string> DefaultTestConfiguration => new()
        {
            { $"{ConfigurationRootNames.Smtp}:{nameof(EmailServiceConfiguration.FeedbackFrom)}", "test@test.com" },
            { $"{ConfigurationRootNames.Smtp}:{nameof(EmailServiceConfiguration.FeedbackTo)}:01", "test01@test.com" },
            { $"{ConfigurationRootNames.Smtp}:{nameof(EmailServiceConfiguration.FeedbackTo)}:02", "test02@test.com" },
            { $"{ConfigurationRootNames.Performance}:{nameof(PerformanceConfiguration.MaxRecordsDownload)}", "100000" }
        };

        [TestInitialize]
        public virtual void BaseTestInitialize()
        {
            var services = new ServiceCollection()
                .AddLogging(config => config.AddConsole())
                .BuildServiceProvider();

            _loggerFactory = services.GetRequiredService<ILoggerFactory>();
        }

        [TestCleanup]
        public void BaseTestCleanup()
        {
            _loggerFactory.Dispose();
        }

        internal PerformanceConfiguration CreatePerformanceConfiguration()
        {
            return new PerformanceConfiguration
            {
                WaterRightsSearchPageSize = 100,
                MaxRecordsDownload = 100000,
            };
        }

        public ILogger<T> CreateLogger<T>()
        {
            return _loggerFactory.CreateLogger<T>();
        }
    }
}