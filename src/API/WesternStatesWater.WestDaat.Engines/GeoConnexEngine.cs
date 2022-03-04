using WesternStatesWater.WestDaat.Accessors;
using System;
using System.Dynamic;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Engines.Resources;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines
{
    public class GeoConnexEngine : EngineBase, IGeoConnexEngine
    {
        public GeoConnexEngine(ILogger<GeoConnexEngine> logger) : base(logger)
        {
        }

        public string BuildGeoConnexJson(Site site, Organization org)
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