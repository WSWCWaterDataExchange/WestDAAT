using WesternStatesWater.WestDaat.Tests.Helpers;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests;

[TestClass]
public class FluentAssertionsExtensionsTests
{
    [DataTestMethod]
    [DataRow(1.5, 1.0, 50, true)] // 50% of 1.0 is 0.5 -> 1.5 is within 0.5 of 1.0
    [DataRow(1.5, 1.0, 60.0, true)] // 60% of 1.0 is 0.6 -> 1.5 is within 0.6 of 1.0
    [DataRow(1.5, 1.0, 40.0, false)] // 40% of 1.0 is 0.4 -> 1.5 is not within 0.4 of 1.0
    [DataRow(1.5, 1.0, 49.9, false)] // 49.9% of 1.0 is 0.499 -> 1.5 is not within 0.499 of 1.0
    [DataRow(1100, 1000, 10, true)] // 10% of 1000 is 100 -> 1100 is within 100 of 1000
    [DataRow(1100, 1000, 9.9, false)] // 9.9% of 1000 is 99 -> 1100 is not within 99 of 1000
    public void BeWithinPercentOf_Success(double actualValue, double expectedValue, double percentageTolerance, bool shouldPass)
    {
        var call = () => actualValue.Should().BeWithinPercentOf(expectedValue, percentageTolerance);

        if (shouldPass)
        {
            call.Should().NotThrow();
        }
        else
        {
            call.Should().Throw<AssertFailedException>();
        }
    }
}
