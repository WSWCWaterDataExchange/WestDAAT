using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common;
using Newtonsoft.Json;
using WesternStatesWater.WestDaat.Contracts.Client;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class WaterAllocation : FunctionBase
    {
        public WaterAllocation(IWaterAllocationManager waterAllocationManager, ILogger<WaterAllocation> logger)
        {
            _waterAllocationManager = waterAllocationManager;
            _logger = logger;
        }

        private readonly IWaterAllocationManager _waterAllocationManager;
        private readonly ILogger _logger;

        [FunctionName(nameof(NldiFeatures))]
        public async Task<IActionResult> NldiFeatures([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "NldiFeatures/@{latitude},{longitude}")] HttpRequest req, double latitude, double longitude)
        {
            _logger.LogInformation("Getting NLDI Features []");

            var directions = Enum.Parse<NldiDirections>(req.Query["dir"]);
            var dataPoints = Enum.Parse<NldiDataPoints>(req.Query["points"]);

            var results = await _waterAllocationManager.GetNldiFeatures(latitude, longitude, directions, dataPoints);

            return JsonResult(results);
        }

        [FunctionName(nameof(GetWaterAllocationSiteDetails)), AllowAnonymous]
        public async Task<IActionResult> GetWaterAllocationSiteDetails([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "sites/{siteUuid}/geoconnex")] HttpRequest request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterAllocationSiteGeoconnexIntegrationData(siteUuid);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetSiteDetails)), AllowAnonymous]
        public async Task<IActionResult> GetSiteDetails([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}")] HttpRequest request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetSiteDetails(siteUuid);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetWaterRightDetails)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightDetails([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{waterRightId}")] HttpRequest request, long waterRightId)
        {
            var result = await _waterAllocationManager.GetWaterRightDetails(waterRightId);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetWaterRightSiteInfoList)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightSiteInfoList([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{waterRightId}/Sites")] HttpRequest request, long waterRightId)
        {
            var result = await _waterAllocationManager.GetWaterRightSiteInfoList(waterRightId);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetWaterRightSourceInfoList)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightSourceInfoList([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{waterRightId}/Sources")] HttpRequest request, long waterRightId)
        {
            var result = await _waterAllocationManager.GetWaterRightSourceInfoList(waterRightId);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetWaterRightSiteDigest)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightSiteDigest([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/WaterRightsDigest")] HttpRequest request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightsDigestsBySite(siteUuid);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetRiverBasinNames)), AllowAnonymous]
        public IActionResult GetRiverBasinNames([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "RiverBasins")] HttpRequest request)
        {
            var result = _waterAllocationManager.GetRiverBasinNames();

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetRiverBasinPolygonsByName)), AllowAnonymous]
        public async Task<IActionResult> GetRiverBasinPolygonsByName([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "RiverBasins")] HttpRequest request)
        {
            string requestBody = String.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            var basinNames = JsonConvert.DeserializeObject<string[]>(requestBody);

            var result = _waterAllocationManager.GetRiverBasinPolygonsByName(basinNames);

            return new OkObjectResult(JsonSerializer.Serialize(result));
        }

        [FunctionName(nameof(GetWaterRightSiteLocations)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightSiteLocations([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{waterRightId}/SiteLocations")] HttpRequest request, long waterRightId)
        {
            var result = await _waterAllocationManager.GetWaterRightSiteLocations(waterRightId);

            return new OkObjectResult(JsonSerializer.Serialize(result));
        }
    }
}
