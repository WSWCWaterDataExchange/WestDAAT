using FluentAssertions;
using FluentAssertions.Numeric;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public static class FluentAssertionsExtensions
{
    public static void BeWithinPercentOf(this NumericAssertions<double> assertions, double expectedValue, double percentage)
    {
        var actualValue = assertions.Subject.Value;
        var acceptableDifference = expectedValue * percentage / 100;

        var maximumAcceptableValue = expectedValue + acceptableDifference;
        var minimumAcceptableValue = expectedValue - acceptableDifference;

        assertions.Subject.Should().BeInRange(minimumAcceptableValue, maximumAcceptableValue, $"because the value should be within {percentage}% of {expectedValue}");
    }
}
