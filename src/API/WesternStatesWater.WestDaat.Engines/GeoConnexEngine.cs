using Microsoft.Extensions.Logging;
using System.Text.Json;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Engines
{
    public sealed class GeoConnexEngine : EngineBase, IGeoConnexEngine
    {
        private readonly ITemplateResourceSdk _templateResourceSdk;

        public GeoConnexEngine(ITemplateResourceSdk rss, ILogger<GeoConnexEngine> logger) : base(logger)
        {
            _templateResourceSdk = rss;
        }

        string IGeoConnexEngine.BuildGeoConnexJson(Site site, Organization org)
        {
            var file = _templateResourceSdk.GetTemplate(Common.ResourceType.JsonLD);
            var geoConnexJson = string.Format(file,
                JsonEncode(
                    site.Longitude,                 // {0}
                    site.Latitude,                  // {1}
                    site.SiteTypeCv,                // {2}
                    site.SiteUuid,                  // {3}
                    site.GniscodeCv,                // {4}
                    site.SiteName,                  // {5}
                    org.OrganizationDataMappingUrl, // {6}
                    site.Geometry?.ToString()       // {7}
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