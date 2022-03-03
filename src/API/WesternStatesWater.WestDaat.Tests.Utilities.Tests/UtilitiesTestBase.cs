using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests
{
    [TestClass]
    public abstract class UtilitiesTestBase : IDisposable
    {
        static UtilitiesTestBase()
        {
            Configuration = new ConfigurationBuilder()
                                        .AddInMemoryCollection(ConfigurationHelper.DefaultConfiguration)
                                        .AddInMemoryCollection(DefaultTestConfiguration)
                                        .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                                        .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                                        .AddEnvironmentVariables()
                                        .Build();
        }

        public static Dictionary<string, string> DefaultTestConfiguration => new()
        {

        };

        private ILoggerFactory? _loggerFactory;
        public static IConfiguration Configuration { get; private set; }

        [TestInitialize]
        public void BaseTestInitialize()
        {
            _loggerFactory = LoggerFactory.Create(a =>
            {
                a.AddConfiguration(Configuration.GetSection("Logging"));
                a.AddConsole();
            });
        }

        [TestCleanup]
        public void BaseTestCleanup()
        {
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