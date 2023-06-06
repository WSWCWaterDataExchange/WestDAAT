using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client;
using JsonSerializer = System.Text.Json.JsonSerializer;
using Microsoft.AspNetCore.Http.Features;
using WesternStatesWater.WestDaat.Common.Exceptions;

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

        // Water Right Routes
        [FunctionName(nameof(FindWaterRights)), AllowAnonymous]
        public async Task<IActionResult> FindWaterRights([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "WaterRights/find")] HttpRequest request)
        {
            string requestBody = string.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            var searchRequest = JsonConvert.DeserializeObject<WaterRightsSearchCriteriaWithPaging>(requestBody);

            var result = await _waterAllocationManager.FindWaterRights(searchRequest);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetWaterRightDetails)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightDetails([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{allocationUuid}")] HttpRequest request, string allocationUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightDetails(allocationUuid);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetWaterRightSiteInfoList)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightSiteInfoList([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{allocationUuid}/Sites")] HttpRequest request, string allocationUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightSiteInfoList(allocationUuid);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetWaterRightSourceInfoList)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightSourceInfoList([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{allocationUuid}/Sources")] HttpRequest request, string allocationUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightSourceInfoList(allocationUuid);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetWaterRightSiteLocations)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightSiteLocations([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{allocationUuid}/SiteLocations")] HttpRequest request, string allocationUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightSiteLocations(allocationUuid);

            return new OkObjectResult(JsonSerializer.Serialize(result));
        }

        [FunctionName(nameof(GetAnalyticsSummaryInformation)), AllowAnonymous]
        public async Task<IActionResult> GetAnalyticsSummaryInformation([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "WaterRights/AnalyticsSummaryInformation")] HttpRequest request)
        {
            string requestBody = string.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            var searchRequest = JsonConvert.DeserializeObject<WaterRightsSearchCriteria>(requestBody);

            var result = await _waterAllocationManager.GetAnalyticsSummaryInformation(searchRequest);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetWaterRightsEnvelope)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightsEnvelope([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "WaterRights/DataEnvelope")] HttpRequest request)
        {
            string requestBody = string.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            var searchRequest = JsonConvert.DeserializeObject<WaterRightsSearchCriteria>(requestBody);

            var result = await _waterAllocationManager.GetWaterRightsEnvelope(searchRequest);

            return new OkObjectResult(JsonSerializer.Serialize(result));
        }

        // Site Routes
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

        [FunctionName(nameof(GetWaterRightSiteDigest)), AllowAnonymous]
        public async Task<IActionResult> GetWaterRightSiteDigest([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/WaterRightsDigest")] HttpRequest request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightsDigestsBySite(siteUuid);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetSiteDigest)), AllowAnonymous]
        public async Task<IActionResult> GetSiteDigest([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/Digest")] HttpRequest request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetSiteDigest(siteUuid);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetSiteLocation)), AllowAnonymous]
        public async Task<IActionResult> GetSiteLocation([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/SiteLocation")] HttpRequest request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterSiteLocation(siteUuid);

            return new OkObjectResult(JsonSerializer.Serialize(result));
        }

        [FunctionName(nameof(GetWaterSiteSourceListByUuid)), AllowAnonymous]
        public async Task<IActionResult> GetWaterSiteSourceListByUuid([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/Sources")] HttpRequest request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterSiteSourceInfoListByUuid(siteUuid);

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetWaterSiteRightsListByUuid)), AllowAnonymous]
        public async Task<IActionResult> GetWaterSiteRightsListByUuid([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/Rights")] HttpRequest request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterSiteRightsInfoListByUuid(siteUuid);

            return new OkObjectResult(result);
        }


        [FunctionName(nameof(DownloadWaterRights)), AllowAnonymous]
        public async Task<EmptyResult> DownloadWaterRights([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "WaterRights/download")] HttpRequest request)
        {
            // the IO operations have to be synchronous 
            var feature = request.HttpContext.Features.Get<IHttpBodyControlFeature>();
            feature.AllowSynchronousIO = true;

            using var streamReader = new StreamReader(request.Body);
            var requestBody = await streamReader.ReadToEndAsync();
            var searchRequest = JsonConvert.DeserializeObject<WaterRightsSearchCriteriaWithFilterUrl>(requestBody);

            var response = request.HttpContext.Response;
            response.Headers.Add("Content-Type", "application/octet-stream");
            response.Headers.Append("Content-Disposition", "attachment; filename=\"WaterRights.zip\"");

            try
            {
                await _waterAllocationManager.WaterRightsAsZip(response.Body, searchRequest);
            }
            catch (WestDaatException)
            {
                response.StatusCode = StatusCodes.Status413PayloadTooLarge;
            }
            catch (Exception)
            {
                response.StatusCode = StatusCodes.Status500InternalServerError;
                throw;
            }

            return new EmptyResult();
        }
    }
}
