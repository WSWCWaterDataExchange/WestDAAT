using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Engines;

namespace WesternStatesWater.WestDaat.Tests.EngineTests
{
    public abstract class EngineTestBase
    {
        private ILoggerFactory _loggerFactory;

        protected Mock<IApplicationAccessor> ApplicationAccessorMock { get; set; }

        protected Mock<IUserAccessor> UserAccessorMock { get; set; }

        protected Mock<IOrganizationAccessor> OrganizationAccessorMock { get; set; }

        [TestInitialize]
        public virtual void BaseTestInitialize()
        {
            var services = new ServiceCollection()
                .AddLogging(config => config.AddConsole());

            RegisterAccessorServices(services);

            _loggerFactory = services
                .BuildServiceProvider()
                .GetRequiredService<ILoggerFactory>();
        }

        [TestCleanup]
        public void BaseTestCleanup()
        {
            _loggerFactory.Dispose();
        }

        public ILogger<T> CreateLogger<T>()
        {
            return _loggerFactory.CreateLogger<T>();
        }

        private void RegisterAccessorServices(IServiceCollection serviceCollection)
        {
            ApplicationAccessorMock = new Mock<IApplicationAccessor>(MockBehavior.Strict);
            UserAccessorMock = new Mock<IUserAccessor>(MockBehavior.Strict);
            OrganizationAccessorMock = new Mock<IOrganizationAccessor>(MockBehavior.Strict);

            serviceCollection.AddTransient<IApplicationAccessor, ApplicationAccessor>();
            serviceCollection.AddTransient<IOrganizationAccessor, OrganizationAccessor>();
            serviceCollection.AddTransient<IUserAccessor, UserAccessor>();
        }
    }
}