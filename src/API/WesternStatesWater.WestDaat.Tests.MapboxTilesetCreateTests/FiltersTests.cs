using System.Collections.Concurrent;
using System.Reflection;
using FluentAssertions;
using WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate;

namespace WesternStatesWater.WestDaat.Tests.MapboxTilesetCreateTests;

[TestClass]
public class FiltersTests : MapboxTilesetTestBase
{
    [TestMethod]
    public async Task WriteFiltersToDatabase_PopulatesFiltersTable()
    {
        // Arrange
        var dict = (ConcurrentDictionary<string, byte>)typeof(MapboxTileset)
            .GetField("WaterRightBeneficialUses", BindingFlags.NonPublic | BindingFlags.Static)!
            .GetValue(null)!;

        dict.Clear();
        dict.TryAdd("Agriculture Irrigation", 0);

        var overlayStates = (ConcurrentDictionary<string, byte>)typeof(MapboxTileset)
            .GetField("OverlayStates", BindingFlags.NonPublic | BindingFlags.Static)!
            .GetValue(null)!;

        overlayStates.Clear();
        overlayStates.TryAdd("UT", 0);

        var tsVars = (ConcurrentDictionary<string, byte>)typeof(MapboxTileset)
            .GetField("TimeSeriesVariableTypes", BindingFlags.NonPublic | BindingFlags.Static)!
            .GetValue(null)!;

        tsVars.Clear();
        tsVars.TryAdd("Discharge Flow", 0);

        // Act
        await (Task)typeof(MapboxTileset)
            .GetMethod("WriteFiltersToDatabase", BindingFlags.NonPublic | BindingFlags.Static)!
            .Invoke(null, new object[] { Db })!;

        // Assert
        var filters = Db.Filters.ToList();
        filters.Should().ContainSingle(f => f.FilterType == "WaterRightBeneficialUses" && f.WaDeName == "Agriculture Irrigation");
        filters.Should().ContainSingle(f => f.FilterType == "OverlayStates" && f.WaDeName == "UT");
        filters.Should().ContainSingle(f => f.FilterType == "TimeSeriesVariableTypes" && f.WaDeName == "Discharge Flow");
    }
}
