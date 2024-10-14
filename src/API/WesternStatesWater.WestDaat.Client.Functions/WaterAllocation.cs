using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client;
using JsonSerializer = System.Text.Json.JsonSerializer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using WesternStatesWater.WestDaat.Common.Exceptions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

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

        [Function(nameof(NldiFeatures))]
        public async Task<HttpResponseData> NldiFeatures([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "NldiFeatures/@{latitude},{longitude}")] HttpRequestData req, double latitude, double longitude)
        {
            _logger.LogInformation("Getting NLDI Features []");

            var directions = Enum.Parse<NldiDirections>(req.Query["dir"]);
            var dataPoints = Enum.Parse<NldiDataPoints>(req.Query["points"]);

            var results = await _waterAllocationManager.GetNldiFeatures(latitude, longitude, directions, dataPoints);

            return await JsonResult(req, results);
        }

        // Water Right Routes
        [Function(nameof(FindWaterRights))]
        public async Task<HttpResponseData> FindWaterRights([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "WaterRights/find")] HttpRequestData request)
        {
            string requestBody = string.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            
            var searchRequest = JsonConvert.DeserializeObject<WaterRightsSearchCriteriaWithPaging>(requestBody);

            var result = await _waterAllocationManager.FindWaterRights(searchRequest);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetWaterRightDetails))]
        public async Task<HttpResponseData> GetWaterRightDetails([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{allocationUuid}")] HttpRequestData request, string allocationUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightDetails(allocationUuid);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetWaterRightSiteInfoList))]
        public async Task<HttpResponseData> GetWaterRightSiteInfoList([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{allocationUuid}/Sites")] HttpRequestData request, string allocationUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightSiteInfoList(allocationUuid);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetWaterRightSourceInfoList))]
        public async Task<HttpResponseData> GetWaterRightSourceInfoList([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{allocationUuid}/Sources")] HttpRequestData request, string allocationUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightSourceInfoList(allocationUuid);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetWaterRightSiteLocations))]
        public async Task<HttpResponseData> GetWaterRightSiteLocations([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "WaterRights/{allocationUuid}/SiteLocations")] HttpRequestData request, string allocationUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightSiteLocations(allocationUuid);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetAnalyticsSummaryInformation))]
        public async Task<HttpResponseData> GetAnalyticsSummaryInformation([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "WaterRights/AnalyticsSummaryInformation")] HttpRequestData request)
        {
            string requestBody = string.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            var searchRequest = JsonConvert.DeserializeObject<WaterRightsSearchCriteria>(requestBody);

            var result = await _waterAllocationManager.GetAnalyticsSummaryInformation(searchRequest);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetWaterRightsEnvelope))]
        public async Task<HttpResponseData> GetWaterRightsEnvelope([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "WaterRights/DataEnvelope")] HttpRequestData request)
        {
            string requestBody = string.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            var searchRequest = JsonConvert.DeserializeObject<WaterRightsSearchCriteria>(requestBody);

            var result = await _waterAllocationManager.GetWaterRightsEnvelope(searchRequest);

            return await JsonResult(request, result);
        }

        // Site Routes
        [Function(nameof(GetWaterAllocationSiteDetails))]
        public async Task<HttpResponseData> GetWaterAllocationSiteDetails([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "sites/{siteUuid}/geoconnex")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterAllocationSiteGeoconnexIntegrationData(siteUuid);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetSiteDetails))]
        public async Task<HttpResponseData> GetSiteDetails([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetSiteDetails(siteUuid);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetWaterRightSiteDigest))]
        public async Task<HttpResponseData> GetWaterRightSiteDigest([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/WaterRightsDigest")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterRightsDigestsBySite(siteUuid);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetSiteDigest))]
        public async Task<HttpResponseData> GetSiteDigest([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/Digest")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetSiteDigest(siteUuid);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetSiteLocation))]
        public async Task<HttpResponseData> GetSiteLocation([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/SiteLocation")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterSiteLocation(siteUuid);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetWaterSiteSourceListByUuid))]
        public async Task<HttpResponseData> GetWaterSiteSourceListByUuid([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/Sources")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterSiteSourceInfoListByUuid(siteUuid);

            return await JsonResult(request, result);
        }

        [Function(nameof(GetWaterSiteRightsListByUuid))]
        public async Task<HttpResponseData> GetWaterSiteRightsListByUuid([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sites/{siteUuid}/Rights")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterAllocationManager.GetWaterSiteRightsInfoListByUuid(siteUuid);

            return await JsonResult(request, result);
        }


        [Function(nameof(DownloadWaterRights))]
        public async Task<IActionResult> DownloadWaterRights([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "WaterRights/download")] HttpRequest request)
        {
            // the IO operations have to be synchronous 
            var feature = request.HttpContext.Features.Get<IHttpBodyControlFeature>();
            feature.AllowSynchronousIO = true;

            using var streamReader = new StreamReader(request.Body);
            var requestBody = await streamReader.ReadToEndAsync();
            var searchRequest = JsonConvert.DeserializeObject<WaterRightsSearchCriteriaWithFilterUrl>(requestBody);
            var ms = new MemoryStream();
            try
            {
                await _waterAllocationManager.WaterRightsAsZip(ms, searchRequest);
            }
            catch (WestDaatException wex)
            {
                request.HttpContext.Response.StatusCode = (int)HttpStatusCode.RequestEntityTooLarge;
            }
            catch (Exception ex)
            {
                request.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                throw;
            }

            request.HttpContext.Response.Headers.Append("Access-Control-Expose-Headers", "Content-Disposition");
            ms.Seek(0, SeekOrigin.Begin);
            return new FileStreamResult(ms, "application/octet-stream")
            {
                FileDownloadName = "WaterRights.zip"
            };
        }
    }
}
