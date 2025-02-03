using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests;

[TestClass]
public class GeometryHelpersTests : UtilityTestBase
{
    private const string ZeroZeroSquarePolygon = "POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))";

    private const string DplBuildingPolygon = "POLYGON ((" +
        "-96.69001188217317 40.81032882324605, " +
        "-96.69001692854633 40.81069155184097, " +
        "-96.69011208746787 40.81076232744017, " +
        "-96.69057541858164 40.81076754015132, " +
        "-96.69057728099177 40.81033634087484, " +
        "-96.69001188217317 40.81032882324605" +
        "))";

    private const string ZeroAreaPolygon = "POLYGON ((0 0, 0 0, 0 0, 0 0))";

    [DataTestMethod]
    [DataRow(ZeroZeroSquarePolygon, 12_364_025_625.25)]
    [DataRow(DplBuildingPolygon, 2_238.06)]
    [DataRow(ZeroAreaPolygon, 0)]
    // expected areas calculated using google earth
    public void GetGeometryAreaInSquareMeters_Success(string polygonWkt, double expectedAreaSquareMeters)
    {
        var geometry = GeometryHelpers.GetGeometryByWkt(polygonWkt);
        var area = GeometryHelpers.GetGeometryAreaInSquareMeters(geometry);

        var onePercentMarginOfError = expectedAreaSquareMeters * 0.01;
        area.Should().BeApproximately(expectedAreaSquareMeters, onePercentMarginOfError);
    }
}
