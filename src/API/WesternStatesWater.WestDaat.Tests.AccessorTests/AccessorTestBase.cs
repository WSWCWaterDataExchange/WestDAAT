using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Transactions;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public abstract class AccessorTestBase : IDisposable
    {
        static AccessorTestBase()
        {
            Configuration = new ConfigurationBuilder()
                                        .AddInMemoryCollection(ConfigurationHelper.DefaultConfiguration)
                                        .AddInMemoryCollection(DefaultTestConfiguration)
                                        .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                                        .AddJsonFile("personal.settings.json", optional: true, reloadOnChange: true)
                                        .AddEnvironmentVariables()
                                        .Build();
        }

        public static Dictionary<string, string> DefaultTestConfiguration => new()
        {
            { $"{ConfigurationRootNames.Database}:{nameof(DatabaseConfiguration.ConnectionString)}", "Server=.;Initial Catalog=WaDE2Test;Integrated Security=true;" },
            { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxUpstreamMainDistance)}", "5" },
            { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxUpstreamTributaryDistance)}", "4" },
            { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxDownstreamMainDistance)}", "3" },
            { $"{ConfigurationRootNames.Nldi}:{nameof(NldiConfiguration.MaxDownstreamDiversionDistance)}", "2" }
        };

        private ILoggerFactory _loggerFactory;
        public static IConfiguration Configuration { get; private set; }
        private TransactionScope _transactionScopeFixture;

        [TestInitialize]
        public void BaseTestInitialize()
        {
            var transactionOptions = new TransactionOptions
            {
                IsolationLevel = IsolationLevel.ReadCommitted,
                Timeout = TransactionManager.MaximumTimeout
            };
            _transactionScopeFixture = new TransactionScope(
                TransactionScopeOption.Required,
                transactionOptions,
                TransactionScopeAsyncFlowOption.Enabled);

            _loggerFactory = LoggerFactory.Create(a =>
            {
                a.AddConfiguration(Configuration.GetSection("Logging"));
                a.AddConsole();
            });
        }

        [TestCleanup]
        public void BaseTestCleanup()
        {
            _transactionScopeFixture.Dispose();
            _loggerFactory.Dispose();
        }

        protected ILogger<T> CreateLogger<T>()
        {
            return _loggerFactory.CreateLogger<T>();
        }

        internal IDatabaseContextFactory CreateDatabaseContextFactory()
        {
            return new DatabaseContextFactory(Configuration.GetDatabaseConfiguration());
        }

        internal PerformanceConfiguration CreatePerformanceConfiguration()
        {
            return new PerformanceConfiguration
            {
                WaterRightsSearchPageSize = 100
            };
        }

        protected AmbientContext Context { get; } = new AmbientContext();

        protected virtual void Dispose(bool disposing)
        {
            BaseTestCleanup();
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
