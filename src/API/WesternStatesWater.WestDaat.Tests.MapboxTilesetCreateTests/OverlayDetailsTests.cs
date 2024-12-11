using System.Text.Json;
using FluentAssertions;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate;

namespace WesternStatesWater.WestDaat.Tests.MapboxTilesetCreateTests;

[TestClass]
public class OverlayTests : MapboxTilesetTestBase
{
    [TestMethod]
    public async Task CreateOverlay()
    {
        var stateUtah = new StateFaker()
            .RuleFor(r => r.Name, "UT")
            .Generate();
        Db.State.Add(stateUtah);
        await Db.SaveChangesAsync();

        var reportingUnitType = new ReportingUnitTypeCVFaker()
            .Generate();
        Db.ReportingUnitType.Add(reportingUnitType);
        await Db.SaveChangesAsync();

        var statusFinal = new RegulatoryStatusCVFaker().Generate();

        var overlayTypeAdmin = new OverlayTypeFaker()
            .RuleFor(r => r.Name, "AA")
            .RuleFor(r => r.WaDEName, "Administrator")
            .Generate();

        var overlayTypeFederal = new OverlayTypeFaker()
            .RuleFor(r => r.Name, "FF")
            .RuleFor(r => r.WaDEName, "Federal")
            .Generate();
        Db.RegulatoryOverlayType.AddRange(overlayTypeAdmin, overlayTypeFederal);
        await Db.SaveChangesAsync();

        var overlayDimWest = new OverlayDimFaker()
            .RuleFor(r => r.RegulatoryName, "Western Utah Management")
            .RuleFor(r => r.RegulatoryOverlayTypeCV, overlayTypeAdmin.Name)
            .RuleFor(r=>r.RegulatoryStatusCv, statusFinal.Name)
            .Generate();
        var overlayDimNorthwest = new OverlayDimFaker()
            .RuleFor(r => r.RegulatoryName, "Northwestern Utah Management")
            .RuleFor(r => r.RegulatoryOverlayTypeCV, overlayTypeFederal.Name)
            .RuleFor(r=>r.RegulatoryStatusCv, statusFinal.Name)
            .Generate();

        var overlayDimEast = new OverlayDimFaker()
            .RuleFor(r => r.RegulatoryName, "Eastern Utah Management")
            .RuleFor(r => r.RegulatoryOverlayTypeCV, overlayTypeAdmin.Name)
            .RuleFor(r=>r.RegulatoryStatusCv, statusFinal.Name)
            .Generate();
        Db.RegulatoryOverlayDim.AddRange(overlayDimWest, overlayDimNorthwest, overlayDimEast);
        await Db.SaveChangesAsync();

        var reportingUnitDim1 = new ReportingUnitDimFaker()
            .RuleFor(r => r.ReportingUnitName, "Utah GMD #1")
            .RuleFor(r => r.ReportingUnitNativeId, "1")
            .RuleFor(r => r.StateCv, stateUtah.Name)
            .RuleFor(r => r.ReportingUnitTypeCv, reportingUnitType.Name)
            .Generate();
        var reportingUnitDim2 = new ReportingUnitDimFaker()
            .RuleFor(r => r.ReportingUnitName, "Utah GMD #2")
            .RuleFor(r => r.ReportingUnitNativeId, "2")
            .RuleFor(r => r.StateCv, stateUtah.Name)
            .RuleFor(r => r.ReportingUnitTypeCv, reportingUnitType.Name)
            .Generate();
        Db.ReportingUnitsDim.AddRange(reportingUnitDim1, reportingUnitDim2);
        await Db.SaveChangesAsync();

        var reportingUnitFact1 = new ReportingUnitsFactFaker()
            .RuleFor(r => r.RegulatoryOverlayId, overlayDimWest.RegulatoryOverlayId)
            .RuleFor(r => r.ReportingUnitId, reportingUnitDim1.ReportingUnitId)
            .Generate();
        var reportingUnitFact2 = new ReportingUnitsFactFaker()
            .RuleFor(r => r.RegulatoryOverlayId, overlayDimNorthwest.RegulatoryOverlayId)
            .RuleFor(r => r.ReportingUnitId, reportingUnitDim2.ReportingUnitId)
            .Generate();
        var reportingUnitFact3 = new ReportingUnitsFactFaker()
            .RuleFor(r => r.RegulatoryOverlayId, overlayDimEast.RegulatoryOverlayId)
            .RuleFor(r => r.ReportingUnitId, reportingUnitDim2.ReportingUnitId)
            .Generate();
        Db.RegulatoryReportingUnitsFact.AddRange(reportingUnitFact1, reportingUnitFact2, reportingUnitFact3);
        await Db.SaveChangesAsync();

        // Act
        await MapboxTileset.CreateOverlays(Db, GeoJsonDir);
        
        // Assert
        var json = await File.ReadAllTextAsync(Path.Combine("geojson", "Overlays.Polygons.geojson"));
        var features = JsonSerializer.Deserialize<List<Maptiler<OverlayFeatureProperties>>>(json);

        features.Should().NotBeNullOrEmpty();
        features.Should().HaveCount(2);
        
        var resultAdminOverlay = features.First(f => f.properties.uuid == reportingUnitDim1.ReportingUnitUuid);
        resultAdminOverlay.properties.oType.Should().BeEquivalentTo("Administrator");
        var resultFederalOverlay = features.First(f => f.properties.uuid == reportingUnitDim2.ReportingUnitUuid);
        resultFederalOverlay.properties.oType.Should().BeEquivalentTo("Federal", "Administrator");
    }
}