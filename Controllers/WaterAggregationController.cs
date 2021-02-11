using MapboxPrototypeAPI.Accessors;
using MapboxPrototypeAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace MapboxPrototypeAPI.Controllers
{
    class WaterAggregationController : ControllerBase
    {
        private readonly ILogger<WaterAggregationController> _logger;
        private readonly IWaterAggregationAccessor _waterAggregationAccessor;

        public WaterAggregationController(ILogger<WaterAggregationController> logger, IWaterAggregationAccessor waterAggregationAccessor)
        {
            _logger = logger;
            _waterAggregationAccessor = waterAggregationAccessor;
        }

        [FunctionName(nameof(GetWaterAggregation))]
        public OkObjectResult GetWaterAggregation([HttpTrigger("get", Route = "GetWaterAggregation")] HttpRequest request)
        {
            var result = _waterAggregationAccessor.GetAggregatedAmounts();

            return Ok(JsonConvert.SerializeObject(result));
        }

        [FunctionName(nameof(GetWaterAggregationById))]
        public async Task<OkObjectResult> GetWaterAggregationById([HttpTrigger("post", Route = "GetWaterAggregationById")] HttpRequest request)
        {
            var deserializedRequest = await System.Text.Json.JsonSerializer.DeserializeAsync<WaterAggregationRequest>(request.Body);

            var result = _waterAggregationAccessor.GetWaterAggregationById(deserializedRequest);

            return Ok(JsonConvert.SerializeObject(result));
        }
    }
}
