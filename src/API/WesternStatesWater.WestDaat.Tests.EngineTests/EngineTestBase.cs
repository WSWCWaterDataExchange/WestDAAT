﻿using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WestDaat.Tests.EngineTests
{
    public abstract class EngineTestBase
    {
        private ILoggerFactory _loggerFactory;

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

        public ILogger<T> CreateLogger<T>()
        {
            return _loggerFactory.CreateLogger<T>();
        }
    }
}