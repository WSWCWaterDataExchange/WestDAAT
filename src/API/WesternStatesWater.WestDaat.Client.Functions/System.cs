using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using System.Text.Json;
using Azure.Core.Serialization;
using WesternStatesWater.WestDaat.Contracts.Client;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

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

        [Function(nameof(GetBeneficialUses))]
        public async Task<HttpResponseData> GetBeneficialUses([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/beneficialuses")] HttpRequestData req)
        {
            _logger.LogInformation("Getting Beneficial Uses");

            var results = await _systemManager.GetAvailableBeneficialUseNormalizedNames();

            // This cannot run thru CreateOKResponse because the serializer options will convert enum to string
            // This will break the UI.
            var data = req.CreateResponse(HttpStatusCode.OK);
            await data.WriteAsJsonAsync<object>(results, new JsonObjectSerializer(
            new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            }));
            return data;
        }

        [Function(nameof(GetOwnerClassifications))]
        public async Task<HttpResponseData> GetOwnerClassifications([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/ownerclassifications")] HttpRequestData request)
        {
            _logger.LogInformation("Getting Owner Classifications");

            var results = await _systemManager.GetAvailableOwnerClassificationNormalizedNames();

            return await CreateOkResponse(request, results);
        }

        [Function(nameof(GetWaterSourceTypes))]
        public async Task<HttpResponseData> GetWaterSourceTypes([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/watersourcetypes")] HttpRequestData request)
        {
            _logger.LogInformation("Getting Water Source Types");

            var results = await _systemManager.GetAvailableWaterSourceTypeNormalizedNames();

            return await CreateOkResponse(request, results);
        }

        [Function(nameof(GetStates))]
        public async Task<HttpResponseData> GetStates([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/states")] HttpRequestData request)
        {
            _logger.LogInformation("Getting States");

            var results = await _systemManager.GetAvailableStateNormalizedNames();

            return await CreateOkResponse(request, results);
        }

        [Function(nameof(GetRiverBasinNames))]
        public async Task<HttpResponseData> GetRiverBasinNames([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/RiverBasins")] HttpRequestData request)
        {
            var result = _systemManager.GetRiverBasinNames();

            return await CreateOkResponse(request, result);
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

            return await CreateOkResponse(request, result);
        }

        [Function(nameof(GetAllocationTypes))]
        public async Task<HttpResponseData> GetAllocationTypes(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get",
                Route = "system/AllocationTypes")]
            HttpRequestData request)
        {
            var result = await _systemManager.GetAvailableAllocationTypeNormalizedNames();
            return await CreateOkResponse(request, result);
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
