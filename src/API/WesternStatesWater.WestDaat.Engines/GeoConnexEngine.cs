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

        public string BuildGeoconnexJson(Site data)
        {
            // var orgMappingUrl = data.AllocationBridgeSitesFact.FirstOrDefault()?.AllocationAmount?.Organization?.OrganizationDataMappingUrl ?? string.Empty;
            
            // var geoConnexJson = string.Format(GeoConnexResources.GeoConnexJsonTemplate,
            //     data.Longitude,         // {0}
            //     data.Latitude,          // {1}
            //     data.HUC8,              // {2}
            //     data.HUC12,             // {3}
            //     data.County,            // {4}
            //     data.SiteTypeCv,        // {5}
            //     data.SiteUuid,          // {6}
            //     data.GniscodeCv,        // {7}
            //     data.SiteName,          // {8}
            //     orgMappingUrl,          // {9}
            //     data.Geometry?.AsText() // {10}
            // );

            // return geoConnexJson;

            return "todo";
        }
    }
}