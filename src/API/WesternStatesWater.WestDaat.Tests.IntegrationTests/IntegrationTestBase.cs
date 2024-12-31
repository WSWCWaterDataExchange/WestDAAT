using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Transactions;
using MGR = WesternStatesWater.WestDaat.Managers;
using ENG = WesternStatesWater.WestDaat.Engines;
using ACC = WesternStatesWater.WestDaat.Accessors;
using UTIL = WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests
{
    [TestClass]
    public class IntegrationTestBase : IDisposable
    {
        private ILoggerFactory _loggerFactory;

        private TransactionScope _transactionScopeFixture;

        protected IServiceProvider Services { get; private set; }

        protected Mock<UTIL.IContextUtility> ContextUtilityMock { get; private set; }

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
                transactionOptions);

            var serviceCollection = new ServiceCollection()
                .AddLogging(config => config.AddConsole());

            RegisterManagerServices(serviceCollection);
            RegisterEngineServices(serviceCollection);
            RegisterAccessorServices(serviceCollection);
            RegisterUtilityServices(serviceCollection);

            Services = serviceCollection.BuildServiceProvider();

            _loggerFactory = Services.GetRequiredService<ILoggerFactory>();
        }

        private void RegisterManagerServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<CLI.IApplicationManager, MGR.ConservationManager>();
            serviceCollection.AddTransient<CLI.INotificationManager, MGR.NotificationManager>();
            serviceCollection.AddTransient<CLI.ISystemManager, MGR.SystemManager>();
            serviceCollection.AddTransient<CLI.ITestManager, MGR.TestManager>();
            serviceCollection.AddTransient<CLI.IUserManager, MGR.AdminManager>();
            serviceCollection.AddTransient<CLI.IWaterResourceManager, MGR.WaterResourceManager>();

            serviceCollection.AddScoped<
                MGR.Handlers.IManagerRequestHandlerResolver,
                MGR.Handlers.RequestHandlerResolver
            >();

            MGR.Extensions.ServiceCollectionExtensions.RegisterRequestHandlers(serviceCollection);
        }

        private void RegisterEngineServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<ENG.IGeoConnexEngine, ENG.GeoConnexEngine>();
            serviceCollection.AddTransient<ENG.ILocationEngine, ENG.LocationEngine>();
            serviceCollection.AddTransient<ENG.ITestEngine, ENG.TestEngine>();
            serviceCollection.AddTransient<ENG.IValidationEngine, ENG.ValidationEngine>();
        }

        private void RegisterAccessorServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<ACC.IApplicationAccessor, ACC.ApplicationAccessor>();
            serviceCollection.AddTransient<ACC.INldiAccessor, ACC.NldiAccessor>();
            serviceCollection.AddTransient<ACC.ISiteAccessor, ACC.SiteAccessor>();
            serviceCollection.AddTransient<ACC.ISystemAccessor, ACC.SystemAccessor>();
            serviceCollection.AddTransient<ACC.ITestAccessor, ACC.TestAccessor>();
            serviceCollection.AddTransient<ACC.IUserAccessor, ACC.UserAccessor>();
            serviceCollection.AddTransient<ACC.IWaterAllocationAccessor, ACC.WaterAllocationAccessor>();
        }

        private void RegisterUtilityServices(IServiceCollection serviceCollection)
        {
            ContextUtilityMock = new Mock<UTIL.IContextUtility>();
            serviceCollection.AddScoped(_ => ContextUtilityMock.Object);
            serviceCollection.AddTransient<UTIL.ISecurityUtility, UTIL.SecurityUtility>();
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
    }
}