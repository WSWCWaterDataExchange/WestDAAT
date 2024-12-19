using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Handlers;

namespace WesternStatesWater.WestDaat.Managers
{
    public class TestManager : ManagerBase, ITestManager
    {
        private readonly ITestEngine _testEngine;

        public TestManager(ITestEngine testEngine, IManagerRequestHandlerResolver resolver, ILogger<TestManager> logger)
            : base(resolver, logger)
        {
            _testEngine = testEngine;
        }

        public override string TestMe(string input)
        {
            return $"{nameof(TestManager)} : {_testEngine.TestMe(input)}";
        }
    }
}