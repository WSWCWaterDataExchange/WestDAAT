using Newtonsoft.Json;
using System.IO;
using System.Net;
using System.Text.Json;
using Azure.Core.Serialization;
using WesternStatesWater.WestDaat.Contracts.Client;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class System : FunctionBase
    {
        public System(IWaterResourceManager waterResourceManager, INotificationManager notificationManager, ILogger<System> logger)
        {
            _waterResourceManager = waterResourceManager;
            _notificationManager = notificationManager;
            _logger = logger;
        }

        private readonly INotificationManager _notificationManager;
        private readonly IWaterResourceManager _waterResourceManager;
        private readonly ILogger _logger;

        [Function(nameof(GetDashboardFilters))]
        public async Task<HttpResponseData> GetDashboardFilters([HttpTrigger(AuthorizationLevel.Anonymous, "get",
                Route = "system/filters")]
            HttpRequestData req)
        {
            _logger.LogInformation("Loading filters");
            var results = await _waterResourceManager.LoadFilters();
            return await CreateOkResponse(req, results);
        }

        [Function(nameof(GetRiverBasinPolygonsByName))]
        public async Task<HttpResponseData> GetRiverBasinPolygonsByName(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "system/riverBasins")]
            HttpRequestData request)
        {
            var basinNames = await ParseRequestBody<string[]>(request);
            _logger.LogInformation("Get River Basin Polygons by Names {RiverBasins}", string.Join(",", basinNames));
            var result = _waterResourceManager.GetRiverBasinPolygonsByName(basinNames);

            return await CreateOkResponse(request, result);
        }

        [Function(nameof(PostFeedback))]
        public async Task<HttpResponseData> PostFeedback(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "system/feedback")]
            HttpRequestData request)
        {
            var feedbackRequest = await ParseRequestBody<FeedbackRequest>(request);
            await _notificationManager.SendFeedback(feedbackRequest);

            return request.CreateResponse(HttpStatusCode.OK);
        }
    }
}