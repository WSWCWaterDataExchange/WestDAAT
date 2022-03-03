using WesternStatesWater.WestDaat.Engines;
using Microsoft.Extensions.Logging;
using System;
using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers
{
    public class TestManager : ManagerBase, ITestManager
    {
        private readonly ITestEngine _testEngine;

        public TestManager(ITestEngine testEngine, ILogger<TestManager> logger) : base(logger)
        {
            _testEngine = testEngine;
        }

        public override string TestMe(string input)
        {
            return $"{nameof(TestManager)} : {_testEngine.TestMe(input)}";
        }
    }
}
