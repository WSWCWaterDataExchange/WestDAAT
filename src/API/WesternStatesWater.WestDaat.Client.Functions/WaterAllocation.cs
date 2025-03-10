using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using Microsoft.AspNetCore.Http.Features;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client;
using Microsoft.AspNetCore.Mvc;
using WesternStatesWater.WestDaat.Common.Exceptions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.OpenApi.Models;
using FeatureCollection = GeoJSON.Text.Feature.FeatureCollection;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class WaterAllocation : FunctionBase
    {
        public WaterAllocation(IWaterResourceManager waterResourceManager, ILogger<WaterAllocation> logger) : base(logger)
        {
            _waterResourceManager = waterResourceManager;
            _logger = logger;
        }

        private readonly IWaterResourceManager _waterResourceManager;
        private readonly ILogger _logger;
        
        [Function(nameof(NldiFeatures))]
        [OpenApiOperation(nameof(NldiFeatures))]
        [OpenApiParameter("latitude", Type = typeof(double), In = ParameterLocation.Path, Required = true)]
        [OpenApiParameter("longitude", Type = typeof(double), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(FeatureCollection))]
        public async Task<HttpResponseData> NldiFeatures([HttpTrigger(AuthorizationLevel.Function, "get", Route = "NldiFeatures/@{latitude},{longitude}")] HttpRequestData req, double latitude, double longitude)
        {
            _logger.LogInformation("Getting NLDI Features []");
        
            var directions = Enum.Parse<NldiDirections>(req.Query["dir"]);
            var dataPoints = Enum.Parse<NldiDataPoints>(req.Query["points"]);
        
            var results = await _waterResourceManager.GetNldiFeatures(latitude, longitude, directions, dataPoints);
        
            return await CreateOkResponse(req, results);
        }
        
        // Water Right Routes
        [Function(nameof(FindWaterRights))]
        [OpenApiOperation(nameof(FindWaterRights))]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(WaterRightsSearchResults))]
        public async Task<HttpResponseData> FindWaterRights([HttpTrigger(AuthorizationLevel.Function, "post", Route = "WaterRights/find")] HttpRequestData request)
        {
            var searchRequest = await ParseRequestBody<WaterRightsSearchCriteriaWithPaging>(request);
            var result = await _waterResourceManager.FindWaterRights(searchRequest);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetWaterRightDetails))]
        [OpenApiOperation(nameof(GetWaterRightDetails))]
        [OpenApiParameter("allocationUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(WaterRightDetails))]
        public async Task<HttpResponseData> GetWaterRightDetails([HttpTrigger(AuthorizationLevel.Function, "get", Route = "WaterRights/{allocationUuid}")] HttpRequestData request, string allocationUuid)
        {
            var result = await _waterResourceManager.GetWaterRightDetails(allocationUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetWaterRightSiteInfoList))]
        [OpenApiOperation(nameof(GetWaterRightSiteInfoList))]
        [OpenApiParameter("allocationUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(SiteInfoListItem[]))]
        public async Task<HttpResponseData> GetWaterRightSiteInfoList([HttpTrigger(AuthorizationLevel.Function, "get", Route = "WaterRights/{allocationUuid}/Sites")] HttpRequestData request, string allocationUuid)
        {
            var result = await _waterResourceManager.GetWaterRightSiteInfoList(allocationUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        
        [Function(nameof(GetRightUsageInfoByAllocationUuid))]
        [OpenApiOperation(nameof(GetRightUsageInfoByAllocationUuid))]
        [OpenApiParameter("allocationUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(SiteUsageListItem[]))]
        public async Task<HttpResponseData> GetRightUsageInfoByAllocationUuid(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "WaterRights/{allocationUuid}/UsageTable")] 
            HttpRequestData request, 
            string allocationUuid)
        {
            var result = await _waterResourceManager.GetRightUsageInfoListByAllocationUuid(allocationUuid);
            return await CreateOkResponse(request, result);
        }

        
        [Function(nameof(GetWaterRightSourceInfoList))]
        [OpenApiOperation(nameof(GetWaterRightSourceInfoList))]
        [OpenApiParameter("allocationUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(WaterSourceInfoListItem[]))]
        public async Task<HttpResponseData> GetWaterRightSourceInfoList([HttpTrigger(AuthorizationLevel.Function, "get", Route = "WaterRights/{allocationUuid}/Sources")] HttpRequestData request, string allocationUuid)
        {
            var result = await _waterResourceManager.GetWaterRightSourceInfoList(allocationUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetWaterRightSiteLocations))]
        [OpenApiOperation(nameof(GetWaterRightSiteLocations))]
        [OpenApiParameter("allocationUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(FeatureCollection))]
        public async Task<HttpResponseData> GetWaterRightSiteLocations([HttpTrigger(AuthorizationLevel.Function, "get", Route = "WaterRights/{allocationUuid}/SiteLocations")] HttpRequestData request, string allocationUuid)
        {
            var result = await _waterResourceManager.GetWaterRightSiteLocations(allocationUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetAnalyticsSummaryInformation))]
        [OpenApiOperation(nameof(GetAnalyticsSummaryInformation))]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(AnalyticsSummaryInformationResponse))]
        public async Task<HttpResponseData> GetAnalyticsSummaryInformation([HttpTrigger(AuthorizationLevel.Function, "post", Route = "WaterRights/AnalyticsSummaryInformation")] HttpRequestData request)
        {
            var searchRequest = await ParseRequestBody<WaterRightsSearchCriteriaWithGrouping>(request);
        
            var result = await _waterResourceManager.GetAnalyticsSummaryInformation(searchRequest);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetWaterRightsEnvelope))]
        [OpenApiOperation(nameof(GetWaterRightsEnvelope))]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(FeatureCollection))]
        public async Task<HttpResponseData> GetWaterRightsEnvelope([HttpTrigger(AuthorizationLevel.Function, "post", Route = "WaterRights/DataEnvelope")] HttpRequestData request)
        {
            var searchRequest = await ParseRequestBody<WaterRightsSearchCriteria>(request);
        
            var result = await _waterResourceManager.GetWaterRightsEnvelope(searchRequest);
        
            return await CreateOkResponse(request, result);
        }
        
        // Site Routes
        [Function(nameof(GetWaterAllocationSiteDetails))]
        [OpenApiOperation(nameof(GetWaterAllocationSiteDetails))]
        [OpenApiParameter("siteUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(string))]
        public async Task<HttpResponseData> GetWaterAllocationSiteDetails([HttpTrigger(AuthorizationLevel.Function, "get", Route = "sites/{siteUuid}/geoconnex")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterResourceManager.GetWaterAllocationSiteGeoconnexIntegrationData(siteUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetSiteDetails))]
        [OpenApiOperation(nameof(GetSiteDetails))]
        [OpenApiParameter("siteUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(SiteDetails))]
        public async Task<HttpResponseData> GetSiteDetails([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Sites/{siteUuid}")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterResourceManager.GetSiteDetails(siteUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetOverlayDigest))]
        [OpenApiOperation(nameof(GetOverlayDigest))]
        [OpenApiParameter("overlayUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(OverlayDigest[]))]
        public async Task<HttpResponseData> GetOverlayDigest([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Overlays/{overlayUuid}/OverlayDigest")] HttpRequestData request, string overlayUuid)
        {
            var result = await _waterResourceManager.GetOverlayDigestsByUuid(overlayUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetSiteDigest))]
        [OpenApiOperation(nameof(GetSiteDigest))]
        [OpenApiParameter("siteUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(SiteDigest))]
        public async Task<HttpResponseData> GetSiteDigest([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Sites/{siteUuid}/Digest")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterResourceManager.GetSiteDigest(siteUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetSiteLocation))]
        [OpenApiOperation(nameof(GetSiteLocation))]
        [OpenApiParameter("siteUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(GeoJSON.Text.Feature.Feature))]
        public async Task<HttpResponseData> GetSiteLocation([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Sites/{siteUuid}/SiteLocation")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterResourceManager.GetWaterSiteLocation(siteUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetWaterSiteSourceListByUuid))]
        [OpenApiOperation(nameof(GetWaterSiteSourceListByUuid))]
        [OpenApiParameter("siteUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(WaterSourceInfoListItem[]))]
        public async Task<HttpResponseData> GetWaterSiteSourceListByUuid([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Sites/{siteUuid}/Sources")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterResourceManager.GetWaterSiteSourceInfoListByUuid(siteUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetWaterSiteRightsListByUuid))]
        [OpenApiOperation(nameof(GetWaterSiteRightsListByUuid))]
        [OpenApiParameter("siteUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(WaterRightInfoListItem[]))]
        public async Task<HttpResponseData> GetWaterSiteRightsListByUuid([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Sites/{siteUuid}/Rights")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterResourceManager.GetWaterSiteRightsInfoListByUuid(siteUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetWaterRightsListByReportingUnitUuid))]
        [OpenApiOperation(nameof(GetWaterRightsListByReportingUnitUuid))]
        [OpenApiParameter("reportingUnitUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(WaterRightInfoListItem[]))]
        public async Task<HttpResponseData> GetWaterRightsListByReportingUnitUuid(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "Overlays/{reportingUnitUuid}/Rights")] HttpRequestData request,
            string reportingUnitUuid)
        {
            var result = await _waterResourceManager.GetWaterRightsInfoListByReportingUnitUuid(reportingUnitUuid);
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetSiteUsageByByUuid))]
        [OpenApiOperation(nameof(GetSiteUsageByByUuid))]
        [OpenApiParameter("siteUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(SiteUsage))]
        public async Task<HttpResponseData> GetSiteUsageByByUuid([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Sites/{siteUuid}/SiteUsage")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterResourceManager.GetSiteUsageBySiteUuid(siteUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetSiteUsageInfoBySiteUuid))]
        [OpenApiOperation(nameof(GetSiteUsageInfoBySiteUuid))]
        [OpenApiParameter("siteUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(SiteUsageListItem[]))]
        public async Task<HttpResponseData> GetSiteUsageInfoBySiteUuid(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "Sites/{siteUuid}/UsageTable")] HttpRequestData request, 
            string siteUuid)
        {
            var result = await _waterResourceManager.GetSiteUsageInfoListBySiteUuid(siteUuid);
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetSiteVariableInfoListByUuid))]
        [OpenApiOperation(nameof(GetSiteVariableInfoListByUuid))]
        [OpenApiParameter("siteUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(VariableInfoListItem[]))]
        public async Task<HttpResponseData> GetSiteVariableInfoListByUuid([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Sites/{siteUuid}/Variables")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterResourceManager.GetSiteVariableInfoListByUuid(siteUuid);
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(GetOverlayTableDetails))]
        [OpenApiOperation(nameof(GetOverlayTableDetails))]
        [OpenApiParameter("overlayUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(OverlayTableEntry[]))]
        public async Task<HttpResponseData> GetOverlayTableDetails(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "Overlays/{overlayUuid}/Legal")] 
            HttpRequestData request, string overlayUuid)
        {
            var searchCriteria = new OverlayDetailsSearchCriteria
            {
                ReportingUnitUUID = overlayUuid,
            };
        
            var overlayTable = await _waterResourceManager.GetOverlayInfoById(searchCriteria);
            return await CreateOkResponse(request, overlayTable);
        }
        
        [Function(nameof(GetOverlayTableDetailsByAllocation))]
        [OpenApiOperation(nameof(GetOverlayTableDetailsByAllocation))]
        [OpenApiParameter("allocationUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(OverlayTableEntry[]))]
        public async Task<HttpResponseData> GetOverlayTableDetailsByAllocation(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "WaterRights/{allocationUuid}/Overlays")]
            HttpRequestData request, string allocationUuid)
        {
            var searchCriteria = new OverlayDetailsSearchCriteria
            {
                AllocationUUID = allocationUuid,
            };
        
            var overlayTable = await _waterResourceManager.GetOverlayInfoById(searchCriteria);
            return await CreateOkResponse(request, overlayTable);
        }
        
        [Function(nameof(GetOverlayDetails))]
        [OpenApiOperation(nameof(GetOverlayDetails))]
        [OpenApiParameter("overlayUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(OverlayDetails))]
        public async Task<HttpResponseData> GetOverlayDetails([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Overlays/{overlayUuid}")] HttpRequestData request, string overlayUuid)
        {
            var overlay = await _waterResourceManager.GetOverlayDetails(overlayUuid);
            
            return await CreateOkResponse(request, overlay);
        }
        
        [Function(nameof(GetSiteMethodInfoListByUuid))]
        [OpenApiOperation(nameof(GetSiteMethodInfoListByUuid))]
        [OpenApiParameter("siteUuid", Type = typeof(string), In = ParameterLocation.Path, Required = true)]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(MethodInfoListItem[]))]
        public async Task<HttpResponseData> GetSiteMethodInfoListByUuid([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Sites/{siteUuid}/Methods")] HttpRequestData request, string siteUuid)
        {
            var result = await _waterResourceManager.GetSiteMethodInfoListByUuid(siteUuid);
        
            return await CreateOkResponse(request, result);
        }
        
        [Function(nameof(DownloadWaterRights))]
        [OpenApiOperation(nameof(DownloadWaterRights))]
        [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
        public async Task<IActionResult> DownloadWaterRights([HttpTrigger(AuthorizationLevel.Function, "post", Route = "WaterRights/download")] HttpRequest request)
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
                await _waterResourceManager.WaterRightsAsZip(ms, searchRequest);
            }
            catch (WestDaatException)
            {
                request.HttpContext.Response.StatusCode = (int)HttpStatusCode.RequestEntityTooLarge;
            }
            catch (Exception)
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
