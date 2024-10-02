using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using WesternStatesWater.WestDaat.Contracts.Client;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class System : FunctionBase
    {
        public System(ISystemManager systemManager, INotificationManager notificationManager, ILogger<WaterAllocation> logger)
        {
            _systemManager = systemManager;
            _notificationManager = notificationManager;
            _logger = logger;
        }

        private readonly INotificationManager _notificationManager;
        private readonly ISystemManager _systemManager;
        private readonly ILogger _logger;

        [Function(nameof(GetBeneficialUses))]
        public async Task<HttpResponseData> GetBeneficialUses([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/beneficialuses")] HttpRequestData req)
        {
            _logger.LogInformation("Getting Beneficial Uses");

            var results = await _systemManager.GetAvailableBeneficialUseNormalizedNames();

            return JsonResult(req, results);
        }

        [Function(nameof(GetOwnerClassifications))]
        public async Task<HttpResponseData> GetOwnerClassifications([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/ownerclassifications")] HttpRequestData request)
        {
            _logger.LogInformation("Getting Owner Classifications");

            var results = await _systemManager.GetAvailableOwnerClassificationNormalizedNames();

            return JsonResult(request, results);
        }

        [Function(nameof(GetWaterSourceTypes))]
        public async Task<HttpResponseData> GetWaterSourceTypes([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/watersourcetypes")] HttpRequestData request)
        {
            _logger.LogInformation("Getting Water Source Types");

            var results = await _systemManager.GetAvailableWaterSourceTypeNormalizedNames();

            return JsonResult(request, results);
        }

        [Function(nameof(GetStates))]
        public async Task<HttpResponseData> GetStates([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/states")] HttpRequestData request)
        {
            _logger.LogInformation("Getting States");

            var results = await _systemManager.GetAvailableStateNormalizedNames();

            return JsonResult(request, results);
        }

        [Function(nameof(GetRiverBasinNames))]
        public HttpResponseData GetRiverBasinNames([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/RiverBasins")] HttpRequestData request)
        {
            var result = _systemManager.GetRiverBasinNames();

            return JsonResult(request, result);
        }

        [Function(nameof(GetRiverBasinPolygonsByName))]
        public async Task<HttpResponseData> GetRiverBasinPolygonsByName([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "system/RiverBasins")] HttpRequestData request)
        {
            string requestBody = String.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            
            var basinNames = JsonConvert.DeserializeObject<string[]>(requestBody);

            var result = _systemManager.GetRiverBasinPolygonsByName(basinNames);

            return JsonResult(request, result);
        }

        [Function(nameof(PostFeedback))]
        public async Task<HttpResponseData> PostFeedback([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "system/feedback")] HttpRequestData request)
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
