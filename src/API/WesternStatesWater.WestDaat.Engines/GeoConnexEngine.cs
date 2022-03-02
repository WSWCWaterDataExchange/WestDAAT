using WesternStatesWater.WestDaat.Accessors;
using System;
using System.Dynamic;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Engines.Resources;

namespace WesternStatesWater.WestDaat.Engines
{
    public class GeoConnexEngine : EngineBase, IGeoConnexEngine
    {
        public GeoConnexEngine(ILogger<GeoConnexEngine> logger) : base(logger)
        {
        }

        public string BuildGeoconnexJson(SitesDim data)
        {
            var geoConnexJson = string.Format(GeoConnexResources.GeoConnexJsonTemplate,
                data.Longitude,
                data.Latitude,
                data.AllocationBridgeSitesFact.First().AllocationAmount.Organization.State,
                data.AllocationBridgeSitesFact.First().AllocationAmount.Organization.OrganizationUuid,
                data.SiteUuid
            );

            return geoConnexJson;
        }
    }
}