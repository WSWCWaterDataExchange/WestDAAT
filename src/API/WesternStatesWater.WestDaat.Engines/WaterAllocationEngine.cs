using WesternStatesWater.WestDaat.Accessors;
using System;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Engines
{
    public class WaterAllocationEngine : EngineBase, IWaterAllocationEngine
    {
        public WaterAllocationEngine(ILogger<WaterAllocationEngine> logger) : base(logger)
        {
        }

        public string BuildGeoconnexJson(SitesDim sitesDim)
        {
            var goeConnexJson = "{"
                                + "   \"@context\": ["
                                + "       {"
                                + "           \"schema\": \"https://schema.org/\","
                                + "           \"geojson\": \"https://purl.org/geojson/vocab#\","
                                + "           \"Feature\": \"geojson:Feature\","
                                + "           \"FeatureCollection\": \"geojson:FeatureCollection\","
                                + "           \"Point\": \"geojson:Point\","
                                + "           \"bbox\": {"
                                + "               \"@container\": \"@list\","
                                + "               \"@id\": \"geojson:bbox\""
                                + "           },"
                                + "           \"coordinates\": {"
                                + "               \"@container\": \"@list\","
                                + "               \"@id\": \"geojson:coordinates\""
                                + "           },"
                                + "           \"features\": {"
                                + "               \"@container\": \"@set\","
                                + "               \"@id\": \"geojson:features\""
                                + "           },"
                                + "           \"geometry\": \"geojson:geometry\","
                                + "           \"id\": \"@id\","
                                + "           \"properties\": \"geojson:properties\","
                                + "           \"type\": \"@type\""
                                + "       },"
                                + "       {"
                                + "           \"schema\": \"https://schema.org/\","
                                + "           \"id\": \"schema:name\","
                                + "           \"LINK\": \"schema:url\""
                                + "       },"
                                + "       {"
                                + "           \"uri\": \"@id\""
                                + "       }"
                                + "   ],"
                                + "   \"type\": \"Feature\","
                                + "   \"geometry\": {"
                                + "       \"type\": \"Point\","
                                + "       \"coordinates\": ["
                                + data.longitude + ","
                                + data.latitude
                                + "       ]"
                                + "   },"
                                + "   \"properties\": {"
                                + "       \"fid\": 101913,"
                                + "       \"StateID\":"
                                + data.allocationBridgeSitesFacts[0].allocationAmount.organization.state + ","
                                + "       \"DataSourceOrganizationID\":"
                                + data.allocationBridgeSitesFacts[0].allocationAmount.organization.organizationUuid +
                                ","
                                + "       \"id\": \"https://geoconnex.us/wade/sites/\"" + data.siteUuid + ","
                                + "       \"uri\": \"https://geoconnex.us/wade/sites/\"" + data.siteUuid + ","
                                + "       \"LINK\": \"https://wade-api-qa.azure-api.net/v1/SiteAllocationAmounts?SiteUUID=\""
                                + data.siteUuid
                                + "   },"
                                + "   \"id\": \"https://geoconnex.us/wade/sites/\"" + data.siteUuid
                                + "}";
            
            var data = new SitesDim();

            return "";
        }
    }
}

}