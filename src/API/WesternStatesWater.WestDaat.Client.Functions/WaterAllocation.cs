using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs;
using Microsoft.AspNetCore.Http;
using System.IO;
using WesternStatesWater.WestDaat.Managers;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class WaterAllocation
    {
        private readonly ILogger<WaterAllocation> _logger;
        private readonly IWaterAllocationManager _waterAllocationManager;

        public WaterAllocation(ILogger<WaterAllocation> logger, IWaterAllocationManager waterAllocationManager)
        {
            _logger = logger;
            _waterAllocationManager = waterAllocationManager;
        }

        [FunctionName(nameof(GetWaterAllocationSiteDetails))]
        public async Task<IActionResult> GetWaterAllocationSiteDetails([HttpTrigger("post", Route = "GetWaterAllocationSiteDetails")] HttpRequest request)
        {
            var siteUuid = await JsonSerializer.DeserializeAsync<string>(request.Body);

            var result = _waterAllocationManager.GetWaterAllocationSiteDetailsById(siteUuid);

            return new OkObjectResult(result);
        }
    }
}
