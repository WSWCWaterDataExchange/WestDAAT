using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.EngineTests
{
    public abstract class EngineTestBase
    {
        private ILoggerFactory _loggerFactory;

        protected Mock<IApplicationAccessor> ApplicationAccessorMock { get; set; }

        protected Mock<IUserAccessor> UserAccessorMock { get; set; }

        protected Mock<IOrganizationAccessor> OrganizationAccessorMock { get; set; }

        protected Mock<ISecurityUtility> SecurityUtilityMock { get; set; }

        protected IServiceProvider Services { get; private set; }

        [TestInitialize]
        public virtual void BaseTestInitialize()
        {
            var services = new ServiceCollection()
                .AddLogging(config => config.AddConsole());

            RegisterConfigurationServices(services);
            RegisterAccessorServices(services);

            Services = services.BuildServiceProvider();
            _loggerFactory = Services.GetRequiredService<ILoggerFactory>();
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

        public static Dictionary<string, string> DefaultTestConfiguration => new()
        {
            { $"{ConfigurationRootNames.Environment}:{nameof(EnvironmentConfiguration.SiteUrl)}", "http://localhost:3000" },
        };

        private void RegisterConfigurationServices(IServiceCollection serviceCollection)
        {
            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(ConfigurationHelper.DefaultConfiguration)
                .AddInMemoryCollection(DefaultTestConfiguration)
                .AddEnvironmentVariables()
                .Build();

            serviceCollection.AddScoped(_ => config.GetEnvironmentConfiguration());
            serviceCollection.AddScoped(_ => config.GetSmtpConfiguration());
        }

        private void RegisterAccessorServices(IServiceCollection serviceCollection)
        {
            ApplicationAccessorMock = new Mock<IApplicationAccessor>(MockBehavior.Strict);
            UserAccessorMock = new Mock<IUserAccessor>(MockBehavior.Strict);
            OrganizationAccessorMock = new Mock<IOrganizationAccessor>(MockBehavior.Strict);
            SecurityUtilityMock = new Mock<ISecurityUtility>(MockBehavior.Strict);
        }
    }
}