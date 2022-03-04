using Microsoft.Extensions.Logging;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Engines.Resources;

namespace WesternStatesWater.WestDaat.Engines
{
    public class GeoConnexEngine : EngineBase, IGeoConnexEngine
    {
        public GeoConnexEngine(ILogger<GeoConnexEngine> logger) : base(logger)
        {
        }

        string IGeoConnexEngine.BuildGeoConnexJson(Site site, Organization org)
        {
            var geoConnexJson = string.Format(GeoConnexResources.GeoConnexJsonTemplate,
                JsonEncode(
                    site.Longitude,                 // {0}
                    site.Latitude,                  // {1}
                    site.HUC8,                      // {2}
                    site.HUC12,                     // {3}
                    site.County,                    // {4}
                    site.SiteTypeCv,                // {5}
                    site.SiteUuid,                  // {6}
                    site.GniscodeCv,                // {7}
                    site.SiteName,                  // {8}
                    org.OrganizationDataMappingUrl, // {9}
                    site.Geometry?.ToString()       // {10}
                )
            );

            return geoConnexJson;
        }
        private string[] JsonEncode(params object[] args)
        {
            return args.Select(arg =>
                JsonEncodedText.Encode(arg?.ToString() ?? string.Empty).ToString()
            ).ToArray();
        }

    }
}