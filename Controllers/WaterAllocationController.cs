using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MapboxPrototypeAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Newtonsoft.Json;
using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using MapboxPrototypeAPI.Accessors;
using Microsoft.Azure.WebJobs;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace MapboxPrototypeAPI.Controllers
{
    public class WaterAllocationController : ControllerBase
    {
        private readonly ILogger<WaterAllocationController> _logger;
        private readonly IWaterAllocationAccessor _waterAllocationAccessor;

        public WaterAllocationController(ILogger<WaterAllocationController> logger, IWaterAllocationAccessor waterAllocationAccessor)
        {
            _logger = logger;
            _waterAllocationAccessor = waterAllocationAccessor;
        }

        private readonly string[] WaDEClassifications = new string[] { "Agricultural", "Aquaculture", "Commercial", "Domestic", "Environmental", "Fire",
        "Fish", "Flood Control", "Heating and Cooling", "Industrial", "Instream Flow", "Livestock", "Mining", "Municipal", "Other", "Power", "Recharge",
        "Recreation", "Snow Making", "Storage", "Unspecified", "Wildlife" };

        [FunctionName(nameof(GetWaterAllocationData))]
        public async Task<OkObjectResult> GetWaterAllocationData([HttpTrigger("post", Route = "GetWaterAllocationData")]HttpRequest request)
        {
            var siteIds = await System.Text.Json.JsonSerializer.DeserializeAsync<List<long>>(request.Body);

            var allocations = _waterAllocationAccessor.GetWaterAllocationDataById(siteIds).ToList();
            var result = formatAllocationSearchResults(allocations);

            return Ok(JsonConvert.SerializeObject(result));
        }

        [FunctionName(nameof(GetWaterAllocations))]
        public IActionResult GetWaterAllocations([HttpTrigger("get", Route = "GetWaterAllocations")]HttpRequest request)
        {
            var allocations = _waterAllocationAccessor.GetAllocations().ToList();
            var allAllocationsGeoJson = generateAllocation(allocations);

            System.IO.File.WriteAllText(@"C:\DPL\_ProjectFiles\Wade\Compiled Data\_allAllocations.geojson", JsonConvert.SerializeObject(allAllocationsGeoJson));

            foreach (var classification in WaDEClassifications)
            {
                var allocationsByClassification = allocations
                    .Select(x => x)
                    .Where(x => x.AllocationBridgeBeneficialUsesFacts.FirstOrDefault().BeneficialUseCvNavigation.WaDename == classification)
                    .ToList();

                var allocationsArray = generateAllocation(allocationsByClassification);

                var geoJsonData = new GeoJSON()
                {
                    Type = "geojson",
                    Data = new GeoJSONData()
                    {
                        Type = "FeatureCollection",
                        Features = allocationsArray
                    }
                };

                var serializedData = JsonConvert.SerializeObject(geoJsonData);

                System.IO.File.WriteAllText(@"C:\DPL\_ProjectFiles\Wade\Compiled Data\_" + classification + " Allocations.geojson", serializedData);
            }

            return Ok();
        }

        [FunctionName(nameof(GetWaterAllocationSiteDetails))]
        public async Task<OkObjectResult> GetWaterAllocationSiteDetails([HttpTrigger("post", Route = "GetWaterAllocationSiteDetails")] HttpRequest request)
        {
            var siteUuid = await System.Text.Json.JsonSerializer.DeserializeAsync<string>(request.Body);

            var result = _waterAllocationAccessor.GetWaterAllocationSiteDetailsById(siteUuid);

            return Ok(JsonConvert.SerializeObject(result));
        }

        [FunctionName(nameof(GetBasinPolygonByNames))]
        public async Task<OkObjectResult> GetBasinPolygonByNames([HttpTrigger("post", Route = "GetBasinPolygonByNames")] HttpRequest request, ExecutionContext context)
        {
            var basinNames = await System.Text.Json.JsonSerializer.DeserializeAsync<List<string>>(request.Body);

            var result = _waterAllocationAccessor.GetBasinPolygonByNames(basinNames, context);

            return Ok(JsonConvert.SerializeObject(result));
        }

        [FunctionName(nameof(GetWaterAllocationsMetaData))]
        public async Task<OkObjectResult> GetWaterAllocationsMetaData([HttpTrigger("post", Route = "GetWaterAllocationsMetaData")] HttpRequest request, ExecutionContext context)
        {
            var filterValues = await System.Text.Json.JsonSerializer.DeserializeAsync<WaterAllocationMetaDataFilter>(request.Body);
            var result = _waterAllocationAccessor.GetWaterAllocationsMetaData(filterValues, context);

            return Ok(JsonConvert.SerializeObject(result));
        }

        private WaterAllocation[] generateAllocation(List<AllocationAmountsFact> allocations)
        {
            List<WaterAllocation> features = new List<WaterAllocation>();

            foreach (var allocation in allocations)
            {
                var beneficialUse = allocation.AllocationBridgeBeneficialUsesFacts.FirstOrDefault();
                var sites = allocation.AllocationBridgeSitesFacts.Select(x => x.Site).ToList();

                foreach(var site in sites)
                {
                    if (site.Longitude == null || site.Latitude == null)
                    {
                        site.Longitude = -40.0;
                        site.Latitude = 110.0;
                    }

                    if (allocation.AllocationOwner == null)
                        allocation.AllocationOwner = "Unknown";

                    if(allocation.AllocationBridgeSitesFacts.FirstOrDefault().Site.WaterSource.WaterSourceTypeCvNavigation == null)
                    {
                        allocation.AllocationBridgeSitesFacts.FirstOrDefault().Site.WaterSource.WaterSourceTypeCvNavigation = new WaterSourceType()
                        {
                            WaDename = "Unknown"
                        };
                    }

                    if (string.IsNullOrEmpty(allocation.OwnerClassificationCV))
                    {
                        allocation.OwnerClassificationCV = "Unspecified";
                    }

                    if (site.SiteUuid == null)
                        site.SiteUuid = "Unknown";

                    if (site.SiteName == null)
                        site.SiteName = "Unknown";

                    if (allocation.AllocationPriorityDate == null)
                        allocation.AllocationPriorityDate = new DateDim() { Date = new DateTime() };

                    var feature = new WaterAllocation()
                    {
                        Type = "Feature",
                        Geometry = new WaterAllocationGeometry()
                        {
                            Type = "Point",
                            Coordinates = new double[2] { (double)site.Longitude, (double)site.Latitude }
                        },
                        Properties = new WaterAllocationProperties()
                        {
                            AllocationId = allocation.AllocationAmountId,
                            AllocationFlowCfs = Convert.ToDouble(allocation.AllocationFlowCfs),
                            AllocationVolumeAf = Convert.ToDouble(allocation.AllocationVolumeAf),
                            SiteUuid = site.SiteUuid,
                            SiteName = site.SiteName,
                            AllocationOwner = allocation.AllocationOwner,
                            OwnerClassification = allocation.OwnerClassificationCV,
                            WaterSourceType = allocation.AllocationBridgeSitesFacts.FirstOrDefault().Site.WaterSource.WaterSourceTypeCvNavigation.WaDename,
                            BeneficialUseCV = beneficialUse.BeneficialUseCvNavigation.WaDename,
                            PriorityDate = (long)(allocation.AllocationPriorityDate.Date - new DateTime(1970, 1, 1)).TotalMilliseconds
                        }
                    };

                    if(site.PodorPousite == "POD" && !site.SiteUuid.StartsWith("TX") && !site.SiteUuid.StartsWith("NM"))
                    {
                        features.Add(feature);
                    }
                }
            }

            return features.ToArray();
        }

        private AllocationSearchResult[] formatAllocationSearchResults(List<AllocationAmountsFact> allocations)
        {
            List<AllocationSearchResult> result = new List<AllocationSearchResult>();

            foreach (var allocation in allocations)
            {
                var beneficialUse = allocation.AllocationBridgeBeneficialUsesFacts.FirstOrDefault();
                var site = allocation.AllocationBridgeSitesFacts.FirstOrDefault().Site;

                allocation.AllocationOwner = allocation.AllocationOwner ?? "Unspecified";

                string expirationDate;
                if (allocation.AllocationExpirationDate == null || allocation.AllocationExpirationDate.Date == null)
                {
                    expirationDate = "Unspecified";
                } else
                {
                    expirationDate = allocation.AllocationExpirationDate.Date.ToString();
                }

                var feature = new AllocationSearchResult()
                {
                    AllocationId = allocation.AllocationAmountId,
                    AllocationExpiration = expirationDate,
                    AllocationOwner = allocation.AllocationOwner ?? "",
                    BeneficialUseCV = beneficialUse.BeneficialUseCvNavigation.WaDename ?? "",
                    OrganizationName = allocation.Organization.OrganizationName ?? "",
                    OrganizationPurview = allocation.Organization.OrganizationPurview ?? "",
                    OrganizationWebsite = allocation.Organization.OrganizationWebsite ?? "",
                    OrganizationPhoneNumber = allocation.Organization.OrganizationPhoneNumber ?? "",
                    OrganizationContactName = allocation.Organization.OrganizationContactName ?? "",
                    OrganizationContactEmail = allocation.Organization.OrganizationContactEmail ?? "",
                    OrganizationState = allocation.Organization.State ?? "",
                    WaterSourceName = allocation.AllocationBridgeSitesFacts.FirstOrDefault().Site.WaterSource.WaterSourceName ?? "",
                    WaterSourceUUID = allocation.AllocationBridgeSitesFacts.FirstOrDefault().Site.WaterSource.WaterSourceUuid ?? "",
                    WaterSourceType = allocation.AllocationBridgeSitesFacts.FirstOrDefault().Site.WaterSource.WaterSourceTypeCv ?? "",
                    VariableType = allocation.VariableSpecific.VariableCv ?? "",
                    VariableAmountUnit = allocation.VariableSpecific.AmountUnitCv ?? "",
                    VariableAggregationInterval = allocation.VariableSpecific.AggregationInterval.ToString() ?? "",
                    VariableAggregationIntervalUnit = allocation.VariableSpecific.AggregationIntervalUnitCv ?? "",
                    SiteUuid = site.SiteUuid,
                    SiteName = site.SiteName,
                    SiteTypeCV = site.SiteTypeCv,
                    SiteEpsgCodeCV = site.EpsgcodeCv,
                    SiteCounty = site.County,
                    SitePOD = site.PodorPousite,
                    SiteLat = site.Latitude,
                    SiteLng = site.Longitude
                };

                result.Add(feature);
            }

            return result.ToArray();
        }
    }
}
