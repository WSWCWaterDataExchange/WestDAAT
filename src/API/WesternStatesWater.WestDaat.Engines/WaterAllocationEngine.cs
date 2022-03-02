using WesternStatesWater.WestDaat.Accessors;
using System;
using System.Dynamic;
using System.Linq;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Engines
{
    public class WaterAllocationEngine : EngineBase, IWaterAllocationEngine
    {
        public WaterAllocationEngine(ILogger<WaterAllocationEngine> logger) : base(logger)
        {
        }

        public string BuildGeoconnexJson(SitesDim data)
        {
            var geoConnexJson = string.Format(GEOCONNEX_JSON_TEMPLATE,
                data.Longitude,
                data.Latitude,
                data.AllocationBridgeSitesFact.First().AllocationAmount.Organization.State,
                data.AllocationBridgeSitesFact.First().AllocationAmount.Organization.OrganizationUuid,
                data.SiteUuid
            );

            return geoConnexJson;
        }
        
        private const string GEOCONNEX_JSON_TEMPLATE = @"
{{
    ""@context"": [
        {{
            ""schema"": ""https://schema.org/"",
            ""geojson"": ""https://purl.org/geojson/vocab#"",
            ""Feature"": ""geojson:Feature"",
            ""FeatureCollection"": ""geojson:FeatureCollection"",
            ""Point"": ""geojson:Point"",
            ""bbox"": {{
                ""@container"": ""@list"",
                ""@id"": ""geojson:bbox""
            }},
            ""coordinates"": {{
                ""@container"": ""@list"",
                ""@id"": ""geojson:coordinates""
            }},
            ""features"": {{
                ""@container"": ""@set"",
                ""@id"": ""geojson:features""
            }},
            ""geometry"": ""geojson:geometry"",
            ""id"": ""@id"",
            ""properties"": ""geojson:properties"",
            ""type"": ""@type""
        }},
        {{
            ""schema"": ""https://schema.org/"",
            ""id"": ""schema:name"",
            ""LINK"": ""schema:url""
        }},
        {{
            ""uri"": ""@id""
        }}
    ],
    ""type"": ""Feature"",
    ""geometry"": {{
        ""type"": ""Point"",
        ""coordinates"": [{0},{1}]
    }},
    ""properties"": {{
        ""fid"": 101913,
        ""StateID"": {2},
        ""DataSourceOrganizationID"": {3},
        ""id"": ""https://geoconnex.us/wade/sites/{4}"",
        ""uri"": ""https://geoconnex.us/wade/sites/{4}"",
        ""LINK"": ""https://wade-api-qa.azure-api.net/v1/SiteAllocationAmounts?SiteUUID={4}""
    }},
    ""id"": ""https://geoconnex.us/wade/sites/{4}""
}}
";

    }
}