using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WaDE.Accessors
{
    public class TestAccessor : AccessorBase, ITestAccessor
    {
        public TestAccessor(ILogger<TestAccessor> logger) : base(logger) { }

        public override string TestMe(string input)
        {
            return $"{nameof(TestAccessor)} : {input}";
        }
    }
}
