using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Reflection;
using System.Transactions;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;
using WesternStatesWater.WestDaat.Managers.Handlers;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests
{
    [TestClass]
    public class IntegrationTestBase : IDisposable
    {
        private ILoggerFactory _loggerFactory;

        private TransactionScope _transactionScopeFixture;

        protected IServiceProvider Services { get; private set; }

        protected Mock<IContextUtility> ContextUtilityMock { get; private set; }

        protected Mock<IOpenEtSdk> OpenEtSdkMock { get; private set; }

        protected Mock<IEmailNotificationSdk> EmailNotificationSdkMock { get; private set; }

        protected Mock<IMessageBusUtility> MessageBusUtilityMock { get; private set; }

        [TestInitialize]
        public void BaseTestInitialize()
        {
            var transactionOptions = new TransactionOptions
            {
                IsolationLevel = IsolationLevel.Serializable,
                Timeout = TransactionManager.MaximumTimeout
            };

            _transactionScopeFixture = new TransactionScope(
                TransactionScopeOption.Required,
                transactionOptions,
                TransactionScopeAsyncFlowOption.Enabled
            );

            var serviceCollection = new ServiceCollection()
                .AddLogging(config => config.AddConsole());

            RegisterConfigurationServices(serviceCollection);
            RegisterManagerServices(serviceCollection);
            RegisterEngineServices(serviceCollection);
            RegisterAccessorServices(serviceCollection);
            RegisterDatabaseServices(serviceCollection);
            RegisterUtilityServices(serviceCollection);

            Services = serviceCollection.BuildServiceProvider();

            _loggerFactory = Services.GetRequiredService<ILoggerFactory>();
        }

        public static Dictionary<string, string> DefaultTestConfiguration => new()
        {
            {
                $"{ConfigurationRootNames.Database}:{nameof(DatabaseConfiguration.WadeConnectionString)}",
                "Server=localhost;Initial Catalog=WaDE2Test;TrustServerCertificate=True;User=sa;Password=DevP@ssw0rd!;Encrypt=False;"
            },
            {
                $"{ConfigurationRootNames.Database}:{nameof(DatabaseConfiguration.WestDaatConnectionString)}",
                "Server=localhost;Initial Catalog=WestDAATTest;TrustServerCertificate=True;User=sa;Password=DevP@ssw0rd!;Encrypt=False;"
            },
            { $"{ConfigurationRootNames.Environment}:{nameof(EnvironmentConfiguration.SiteUrl)}", "http://localhost:3000" },
            { $"{ConfigurationRootNames.MessageBus}:{nameof(MessageBusConfiguration.UseDevelopmentEmulator)}", "true" },
            {
                $"{ConfigurationRootNames.MessageBus}:{nameof(MessageBusConfiguration.ServiceBusUrl)}",
                "Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
            },
        };

        private void RegisterConfigurationServices(IServiceCollection serviceCollection)
        {
            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(ConfigurationHelper.DefaultConfiguration)
                .AddInMemoryCollection(DefaultTestConfiguration)
                .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("personal.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            serviceCollection.AddScoped(_ => config.GetBlobStorageConfiguration());
            serviceCollection.AddScoped(_ => config.GetDatabaseConfiguration());
            serviceCollection.AddScoped(_ => config.GetEnvironmentConfiguration());
            serviceCollection.AddScoped(_ => config.GetMessageBusConfiguration());
            serviceCollection.AddScoped(_ => config.GetPerformanceConfiguration());
            serviceCollection.AddScoped(_ => config.GetSmtpConfiguration());
        }

        private void RegisterManagerServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<CLI.IApplicationManager, ConservationManager>();
            serviceCollection.AddTransient<CLI.INotificationManager, NotificationManager>();
            serviceCollection.AddTransient<CLI.IFileManager, AdminManager>();
            serviceCollection.AddTransient<CLI.IOrganizationManager, AdminManager>();
            serviceCollection.AddTransient<CLI.ITestManager, TestManager>();
            serviceCollection.AddTransient<CLI.IUserManager, AdminManager>();
            serviceCollection.AddTransient<CLI.IWaterResourceManager, WaterResourceManager>();

            serviceCollection.AddScoped<
                IManagerRequestHandlerResolver,
                RequestHandlerResolver
            >();

            Managers.Extensions.ServiceCollectionExtensions.RegisterRequestHandlers(serviceCollection);
        }

        private void RegisterEngineServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<IApplicationFormattingEngine, FormattingEngine>();
            serviceCollection.AddTransient<ICalculationEngine, CalculationEngine>();
            serviceCollection.AddTransient<IGeoConnexEngine, GeoConnexEngine>();
            serviceCollection.AddTransient<ILocationEngine, LocationEngine>();
            serviceCollection.AddTransient<ITestEngine, TestEngine>();
            serviceCollection.AddTransient<IUserNameFormattingEngine, FormattingEngine>();
            serviceCollection.AddTransient<IValidationEngine, ValidationEngine>();
            serviceCollection.AddTransient<INotificationFilteringEngine, FilteringEngine>();
            serviceCollection.AddTransient<INotificationFormattingEngine, FormattingEngine>();
        }

        private void RegisterAccessorServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<IApplicationAccessor, ApplicationAccessor>();
            serviceCollection.AddTransient<INldiAccessor, NldiAccessor>();
            serviceCollection.AddTransient<IOrganizationAccessor, OrganizationAccessor>();
            serviceCollection.AddTransient<ISiteAccessor, SiteAccessor>();
            serviceCollection.AddTransient<ISystemAccessor, SystemAccessor>();
            serviceCollection.AddTransient<ITestAccessor, TestAccessor>();
            serviceCollection.AddTransient<IUserAccessor, UserAccessor>();
            serviceCollection.AddTransient<IWaterAllocationAccessor, WaterAllocationAccessor>();
        }

        private void RegisterDatabaseServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<IDatabaseContextFactory, DatabaseContextFactory>();
            serviceCollection.AddTransient<IWestDaatDatabaseContextFactory, WestDaatDatabaseContextFactory>();
        }

        private void RegisterUtilityServices(IServiceCollection serviceCollection)
        {
            ContextUtilityMock = new Mock<IContextUtility>(MockBehavior.Strict);
            serviceCollection.AddScoped(_ => ContextUtilityMock.Object);
            serviceCollection.AddTransient<ISecurityUtility, SecurityUtility>();

            OpenEtSdkMock = new Mock<IOpenEtSdk>(MockBehavior.Strict);
            serviceCollection.AddScoped(_ => OpenEtSdkMock.Object);

            EmailNotificationSdkMock = new Mock<IEmailNotificationSdk>(MockBehavior.Default);
            serviceCollection.AddScoped(_ => EmailNotificationSdkMock.Object);

            MessageBusUtilityMock = new Mock<IMessageBusUtility>(MockBehavior.Default);
            serviceCollection.AddScoped(_ => MessageBusUtilityMock.Object);

            serviceCollection.AddTransient<IBlobStorageSdk, BlobStorageSdk>();
        }

        [TestCleanup]
        public void BaseTestCleanup()
        {
            _transactionScopeFixture.Dispose();
            _loggerFactory.Dispose();
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

        protected void UseAnonymousContext()
        {
            ContextUtilityMock
                .Setup(mock => mock.GetContext())
                .Returns(new AnonymousContext());

            ContextUtilityMock
                .Setup(mock => mock.GetRequiredContext<ContextBase>())
                .Returns(new AnonymousContext());
        }

        protected void UseIdentityProviderContext()
        {
            ContextUtilityMock
                .Setup(mock => mock.GetContext())
                .Returns(new IdentityProviderContext());

            ContextUtilityMock
                .Setup(mock => mock.GetRequiredContext<ContextBase>())
                .Returns(new IdentityProviderContext());
        }

        protected void UseUserContext(UserContext context = null)
        {
            ContextUtilityMock
                .Setup(mock => mock.GetContext())
                .Returns(context ?? new UserContext());

            ContextUtilityMock
                .Setup(mock => mock.GetRequiredContext<ContextBase>())
                .Returns(context ?? new UserContext());
        }

        protected void UseSystemContext(SystemContext context = null)
        {
            ContextUtilityMock
                .Setup(mock => mock.GetContext())
                .Returns(context ?? new SystemContext());

            ContextUtilityMock
                .Setup(mock => mock.GetRequiredContext<ContextBase>())
                .Returns(context ?? new SystemContext());
        }
    }
}