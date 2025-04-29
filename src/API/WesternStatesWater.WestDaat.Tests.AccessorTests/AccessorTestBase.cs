﻿using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Transactions;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public abstract class AccessorTestBase : IDisposable
    {
        protected IServiceProvider Services { get; private set; }

        static AccessorTestBase()
        {
            Configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(ConfigurationHelper.DefaultConfiguration)
                .AddInMemoryCollection(DefaultTestConfiguration)
                .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("personal.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
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

            var serviceCollection = new ServiceCollection();

            RegisterServices(serviceCollection);

            Services = serviceCollection.BuildServiceProvider();
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

        private void RegisterServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<IBlobStorageSdk, BlobStorageSdk>();
            serviceCollection.AddScoped(_ => Configuration.GetBlobStorageConfiguration());
        }

        internal IDatabaseContextFactory CreateDatabaseContextFactory()
        {
            return new DatabaseContextFactory(Configuration.GetDatabaseConfiguration());
        }

        internal IWestDaatDatabaseContextFactory CreateWestDaatDatabaseContextFactory()
        {
            return new WestDaatDatabaseContextFactory(Configuration.GetDatabaseConfiguration());
        }

        internal PerformanceConfiguration CreatePerformanceConfiguration()
        {
            return new PerformanceConfiguration
            {
                WaterRightsSearchPageSize = 100,
                MaxRecordsDownload = 100000,
            };
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