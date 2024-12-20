using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Transactions;
using MGR = WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests
{
    [TestClass]
    [TestCategory("Integration Tests")]
    public class IntegrationTestBase : IDisposable
    {
        private ILoggerFactory _loggerFactory;

        private TransactionScope _transactionScopeFixture;

        protected IServiceProvider Services { get; private set; }

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

        [TestCleanup]
        public void BaseTestCleanup()
        {
            _transactionScopeFixture.Dispose();
            _loggerFactory.Dispose();
        }

        public ILogger<T> CreateLogger<T>()
        {
            return _loggerFactory.CreateLogger<T>();
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