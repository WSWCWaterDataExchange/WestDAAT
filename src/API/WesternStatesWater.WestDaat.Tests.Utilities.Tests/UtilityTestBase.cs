using System.Reflection;
using System.Transactions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests
{
    [TestClass]
    public abstract class UtilityTestBase : IDisposable
    {
        protected IServiceProvider Services = null!;

        static UtilityTestBase()
        {
            Configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(ConfigurationHelper.DefaultConfiguration)
                .AddInMemoryCollection(DefaultTestConfiguration!)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
                .AddEnvironmentVariables()
                .Build();
        }

        public static Dictionary<string, string> DefaultTestConfiguration => new()
        {
            { $"{ConfigurationRootNames.MessageBus}:{nameof(MessageBusConfiguration.UseDevelopmentEmulator)}", "true" },
            {
                $"{ConfigurationRootNames.MessageBus}:{nameof(MessageBusConfiguration.ServiceBusUrl)}",
                "Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
            },
            {
                $"{ConfigurationRootNames.Database}:{nameof(DatabaseConfiguration.WestDaatConnectionString)}",
                "Server=localhost;Initial Catalog=WestDAATTest;TrustServerCertificate=True;User=sa;Password=DevP@ssw0rd!;Encrypt=False;"
            },
        };

        private ILoggerFactory? _loggerFactory;
        private TransactionScope? _transactionScopeFixture;
        public static IConfiguration Configuration { get; private set; }

        [TestInitialize]
        public void BaseTestInitialize()
        {
            var transactionOptions = new TransactionOptions
            {
                IsolationLevel = IsolationLevel.Serializable, // Serializable needed for service bus
                Timeout = TransactionManager.MaximumTimeout
            };

            _transactionScopeFixture = new TransactionScope(
                TransactionScopeOption.Required,
                transactionOptions,
                TransactionScopeAsyncFlowOption.Enabled
            );

            Services = new ServiceCollection()
                .AddTransient<IWestDaatDatabaseContextFactory, WestDaatDatabaseContextFactory>()
                .AddTransient(_ => Configuration.GetDatabaseConfiguration())
                .AddLogging(config => config.AddConsole())
                .BuildServiceProvider();

            _loggerFactory = LoggerFactory.Create(a =>
            {
                a.AddConfiguration(Configuration.GetSection("Logging"));
                a.AddConsole();
            });
        }

        [TestCleanup]
        public void BaseTestCleanup()
        {
            _transactionScopeFixture?.Dispose();
            _loggerFactory?.Dispose();
        }

        public ILogger<T> CreateLogger<T>()
        {
            return _loggerFactory!.CreateLogger<T>();
        }

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