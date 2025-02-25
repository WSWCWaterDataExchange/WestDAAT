using System.Text.Json;
using FluentAssertions;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Tests.Helpers.Geometry;
using WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate;

namespace WesternStatesWater.WestDaat.Tests.MapboxTilesetCreateTests;

[TestClass]
public class TimeSeriesTests : MapboxTilesetTestBase
{
    [TestMethod]
    public async Task CreateTimeSeries()
    {
        var dates = new DateDimFaker().Generate(10);
        Db.DateDim.AddRange(dates);
        await Db.SaveChangesAsync();

        var sites = new SitesDimFaker()
            .RuleFor(r => r.SitePoint, new PointFaker().Generate())
            .RuleFor(r => r.Geometry, new PointFaker().Generate())
            .Generate(3);
        Db.SitesDim.AddRange(sites);
        await Db.SaveChangesAsync();
        
        var site1TimeSeries = new SiteVariableAmountsFactFaker()
            .RuleFor(r => r.SiteId, sites[0].SiteId)
            .RuleFor(r => r.Site, sites[0])
            .RuleFor(r => r.TimeframeStartID, f => f.PickRandom(dates.Select(x => x.DateId).Take(5)))
            .RuleFor(r => r.TimeframeEndID, f => f.PickRandom(dates.Select(x => x.DateId).Skip(5)))
            .RuleFor(r => r.DataPublicationDateID, dates[4].DateId)
            .Generate(3);
        Db.SiteVariableAmountsFact.AddRange(site1TimeSeries);
        await Db.SaveChangesAsync();
        
        var site2TimeSeries = new SiteVariableAmountsFactFaker()
            .RuleFor(r => r.SiteId, sites[1].SiteId)
            .RuleFor(r => r.Site, sites[1])
            .RuleFor(r => r.TimeframeStartID, f => f.PickRandom(dates.Select(x => x.DateId).Take(5)))
            .RuleFor(r => r.TimeframeEndID, f => f.PickRandom(dates.Select(x => x.DateId).Skip(5)))
            .RuleFor(r => r.DataPublicationDateID, dates[4].DateId)
            .Generate(2);
        Db.SiteVariableAmountsFact.AddRange(site2TimeSeries);
        await Db.SaveChangesAsync();
        
        var site3TimeSeries = new SiteVariableAmountsFactFaker()
            .RuleFor(r => r.SiteId, sites[2].SiteId)
            .RuleFor(r => r.Site, sites[2])
            .RuleFor(r => r.TimeframeStartID, f => f.PickRandom(dates.Select(x => x.DateId).Take(5)))
            .RuleFor(r => r.TimeframeEndID, f => f.PickRandom(dates.Select(x => x.DateId).Skip(5)))
            .RuleFor(r => r.DataPublicationDateID, dates[4].DateId)
            .Generate(1);
        Db.SiteVariableAmountsFact.AddRange(site3TimeSeries);
        await Db.SaveChangesAsync();
        
        // Act
        await MapboxTileset.CreateTimeSeries(Db, GeoJsonDir);
        
        // Assert
        var json = await File.ReadAllTextAsync(Path.Combine("geojson", "TimeSeries.Points.geojson"));
        var features = JsonSerializer.Deserialize<List<Maptiler<TimeSeriesFeatureProperties>>>(json);

        features.Should().NotBeNullOrEmpty();
        features.Should().HaveCount(3);
    }
}