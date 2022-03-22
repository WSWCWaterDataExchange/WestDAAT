using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class System : FunctionBase
    {
        public System(ISystemManager systemManager, ILogger<WaterAllocation> logger)
        {
            _systemManager = systemManager;
            _logger = logger;
        }

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
            _logger.LogInformation("Getting Beneficial Uses");

            var results = await _systemManager.GetAvailableOwnerClassificationNormalizedNames();

            return JsonResult(results);
        }

        [FunctionName(nameof(GetWaterSourceTypes)), AllowAnonymous]
        public async Task<IActionResult> GetWaterSourceTypes([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "system/watersourcetypes")] HttpRequest request)
        {
            _logger.LogInformation("Getting Beneficial Uses");

            var results = await _systemManager.GetAvailableWaterSourceTypeNormalizedNames();

            return JsonResult(results);
        }
    }
}
