using WesternStatesWater.WestDaat.Accessors;
using System;
namespace WesternStatesWater.WestDaat.Engines
{
    public class TestEngine : ITestEngine
    {
        private readonly ITestAccessor _testAccessor;

        public TestEngine(ITestAccessor testAccessor)
        {
            _testAccessor = testAccessor;
        }

        public string TestMe(string input)
        {
            return $"{nameof(TestEngine)} : {_testAccessor.TestMe(input)}";
        }
    }
}
