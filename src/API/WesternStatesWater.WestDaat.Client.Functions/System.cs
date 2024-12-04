using System.Diagnostics;
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
        public System(ISystemManager systemManager, INotificationManager notificationManager, ILogger<System> logger)
        {
            _systemManager = systemManager;
            _notificationManager = notificationManager;
            _logger = logger;
        }

        private readonly INotificationManager _notificationManager;
        private readonly ISystemManager _systemManager;
        private readonly ILogger _logger;

        [Function(nameof(GetDashboardFilters))]
        public async Task<HttpResponseData> GetDashboardFilters([HttpTrigger(AuthorizationLevel.Anonymous, "get",
                Route = "system/filters")]
            HttpRequestData req)
        {
            _logger.LogInformation("Loading filters");
            var results = await _systemManager.LoadFilters();
            return await CreateOkResponse(req, results);
        }

        [Function(nameof(GetRiverBasinPolygonsByName))]
        public async Task<HttpResponseData> GetRiverBasinPolygonsByName(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "system/riverBasins")]
            HttpRequestData request)
        {
            string requestBody = String.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }

            var basinNames = JsonConvert.DeserializeObject<string[]>(requestBody);

            _logger.LogInformation("Get River Basin Polygons by Names {RiverBasins}", string.Join(",", basinNames));
            var result = _systemManager.GetRiverBasinPolygonsByName(basinNames);

            return await CreateOkResponse(request, result);
        }

        [Function(nameof(PostFeedback))]
        public async Task<HttpResponseData> PostFeedback(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "system/feedback")]
            HttpRequestData request)
        {
            string requestBody = string.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }

            var feedbackRequest = JsonConvert.DeserializeObject<FeedbackRequest>(requestBody);

            await _notificationManager.SendFeedback(feedbackRequest);

            return request.CreateResponse(HttpStatusCode.OK);
        }
    }
}