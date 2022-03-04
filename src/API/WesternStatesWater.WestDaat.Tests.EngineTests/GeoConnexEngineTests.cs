using Microsoft.Extensions.Logging.Abstractions;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;
using System.Text.Json.Nodes;
using WesternStatesWater.WestDaat.Common.Exceptions;
using System.Text.Json;
using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Tests.EngineTests
{
    [TestClass]
    public class GeoConnexEngineTests : EngineTestBase
    {
        [TestInitialize]
        public override void TestInitialize()
        {
        }

        [TestMethod]
        public void GeoConnexEngineTests_BuildGeoConnexJson_ShouldFormatJson()
        {
            // ARRANGE 
            var engine = new GeoConnexEngine(NullLogger<GeoConnexEngine>.Instance);
            var efSite = new SitesDimFaker().Generate();

            efSite.SiteTypeCv = efSite.SiteTypeCvNavigation.Name;
            efSite.GniscodeCv = efSite.GniscodeCvNavigation.Name;

            var efOrg = efSite.AllocationBridgeSitesFact.First().AllocationAmount.Organization;

            var site = efSite.Map<Site>();
            var org = efOrg.Map<Organization>();

            // ACT
            var result = engine.BuildGeoConnexJson(site, org);

            // ASSERT
            result.Should().NotBeNullOrWhiteSpace();
            var shouldContainList = new string[]
            {
                site.Longitude.ToString(),
                site.Latitude.ToString(),
                site.HUC8,
                site.HUC12,
                site.County,
                site.SiteTypeCv,
                site.SiteUuid,
                site.GniscodeCv,
                site.SiteName,
                org.OrganizationDataMappingUrl,
                site.Geometry.ToString()
            }.Select(x => JsonEncodedText.Encode(x).ToString());

            foreach (var value in shouldContainList)
            {
                result.Should().Contain(value);
            }

            CheckValidJson(result);
        }

        [TestMethod]
        public void GeoConnexEngineTests_BuildGeoConnexJson_EmptyValues()
        {
            // ARRANGE 
            var engine = new GeoConnexEngine(NullLogger<GeoConnexEngine>.Instance);
            var site = new Site();
            site.Geometry = new Point(0, 0);

            var org = new Organization();

            // ACT
            var result = engine.BuildGeoConnexJson(site, org);

            // ASSERT
            result.Should().NotBeNullOrWhiteSpace();
            result.Should().NotContain("null");

            CheckValidJson(result);
        }

         [TestMethod]
        public void GeoConnexEngineTests_BuildGeoConnexJson_SpecialCharacters()
        {
            // ARRANGE 
            var engine = new GeoConnexEngine(NullLogger<GeoConnexEngine>.Instance);
            var site = new Site();
            site.SiteUuid = "`~=-><./,';:[]{}/!@#$%^&*(),\r\n\"";
            site.SiteName = "`~=-><./,';:[]{}/!@#$%^&*(),\r\n\"";
            site.Geometry = new Point(0, 0);

            var org = new Organization();

            // ACT
            var result = engine.BuildGeoConnexJson(site, org);

            // ASSERT
            result.Should().NotBeNullOrWhiteSpace();
            result.Should().Contain("\u0022"); // Double quotes

            CheckValidJson(result);
        }

        private void CheckValidJson(string json)
        {
            try
            {
                // Check for valid json
                JsonValue.Parse(json);
            }
            catch (Exception e)
            {
                throw new JsonException($"Exception: ${e}. Json: ${json}");
            }
        }
    }
}
