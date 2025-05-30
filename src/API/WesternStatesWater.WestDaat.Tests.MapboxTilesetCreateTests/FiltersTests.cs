using System.Collections.Concurrent;
using System.Reflection;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate;

namespace WesternStatesWater.WestDaat.Tests.MapboxTilesetCreateTests;

[TestClass]
public class FiltersTests : MapboxTilesetTestBase
{
    [TestMethod]
    public async Task WriteFiltersToDatabase_PopulatesFiltersTable()
    {
        // Arrange
        await Db.Filters.ExecuteDeleteAsync();

        SetStaticConcurrentDictionary("WaterRightBeneficialUses", "Agriculture Irrigation");
        SetStaticConcurrentDictionary("OverlayStates", "UT");
        SetStaticConcurrentDictionary("TimeSeriesVariableTypes", "Discharge Flow");

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

    private void SetStaticConcurrentDictionary(string fieldName, string value)
    {
        var dict = (ConcurrentDictionary<string, byte>)typeof(MapboxTileset)
            .GetField(fieldName, BindingFlags.NonPublic | BindingFlags.Static)!
            .GetValue(null)!;

        dict.Clear();
        dict.TryAdd(value, 0);
    }
}