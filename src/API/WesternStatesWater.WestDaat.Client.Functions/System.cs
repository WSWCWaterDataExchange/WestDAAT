using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using WesternStatesWater.WestDaat.Contracts.Client;
using JsonSerializer = System.Text.Json.JsonSerializer;

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

        [FunctionName(nameof(GetBeneficialUses))]
        public async Task<IActionResult> GetBeneficialUses([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/beneficialuses")] HttpRequest req)
        {
            _logger.LogInformation("Getting Beneficial Uses");

            var results = await _systemManager.GetAvailableBeneficialUseNormalizedNames();

            return JsonResult(results);
        }

        [FunctionName(nameof(GetOwnerClassifications)), AllowAnonymous]
        public async Task<IActionResult> GetOwnerClassifications([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/ownerclassifications")] HttpRequest request)
        {
            _logger.LogInformation("Getting Owner Classifications");

            var results = await _systemManager.GetAvailableOwnerClassificationNormalizedNames();

            return JsonResult(results);
        }

        [FunctionName(nameof(GetWaterSourceTypes)), AllowAnonymous]
        public async Task<IActionResult> GetWaterSourceTypes([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/watersourcetypes")] HttpRequest request)
        {
            _logger.LogInformation("Getting Water Source Types");

            var results = await _systemManager.GetAvailableWaterSourceTypeNormalizedNames();

            return JsonResult(results);
        }

        [FunctionName(nameof(GetStates)), AllowAnonymous]
        public async Task<IActionResult> GetStates([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/states")] HttpRequest request)
        {
            _logger.LogInformation("Getting States");

            var results = await _systemManager.GetAvailableStateNormalizedNames();

            return JsonResult(results);
        }

        [FunctionName(nameof(GetRiverBasinNames)), AllowAnonymous]
        public IActionResult GetRiverBasinNames([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/RiverBasins")] HttpRequest request)
        {
            var result = _systemManager.GetRiverBasinNames();

            return new OkObjectResult(result);
        }

        [FunctionName(nameof(GetRiverBasinPolygonsByName)), AllowAnonymous]
        public async Task<IActionResult> GetRiverBasinPolygonsByName([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "system/RiverBasins")] HttpRequest request)
        {
            string requestBody = String.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            var basinNames = JsonConvert.DeserializeObject<string[]>(requestBody);

            var result = _systemManager.GetRiverBasinPolygonsByName(basinNames);

            return new OkObjectResult(JsonSerializer.Serialize(result));
        }

        [FunctionName(nameof(PostFeedback)), AllowAnonymous]
        public async Task PostFeedback([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "system/feedback")] HttpRequest request)
        {
            string requestBody = string.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            var feedbackRequest = JsonConvert.DeserializeObject<FeedbackRequest>(requestBody);

            _notificationManager.SendFeedback(feedbackRequest);
        }
    }
}
