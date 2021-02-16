using MapboxPrototypeAPI.Accessors;
using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using MapboxPrototypeAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
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

        [FunctionName(nameof(GetWaterAggregationTimeSeries))]
        public async Task<OkObjectResult> GetWaterAggregationTimeSeries([HttpTrigger("post", Route = "GetWaterAggregationTimeSeries")] HttpRequest request)
        {
            var deserializedRequest = await System.Text.Json.JsonSerializer.DeserializeAsync<WaterAggregationRequest>(request.Body);

            var result = _waterAggregationAccessor.GetWaterAggregationByFilterValues(deserializedRequest).ToList();

            return Ok(JsonConvert.SerializeObject(result));
        }

        [FunctionName(nameof(GetWaterAggregationByFilterValues))]
        public async Task<OkObjectResult> GetWaterAggregationByFilterValues([HttpTrigger("post", Route = "GetWaterAggregationByFilterValues")] HttpRequest request)
        {
            var deserializedRequest = await System.Text.Json.JsonSerializer.DeserializeAsync<WaterAggregationRequest>(request.Body);

            var result = _waterAggregationAccessor.GetWaterAggregationByFilterValues(deserializedRequest).ToList();

            return Ok(JsonConvert.SerializeObject(FormatAggregationData(result)));
        }

        private WaterAggregationResponse FormatAggregationData(List<AggregatedAmountsFact> aggregationData)
        {
            if(aggregationData.Count == 0)
            {
                return new WaterAggregationResponse()
                {
                    AggregationData = aggregationData,
                    MinimumAmount = 0,
                    MaximumAmount = 0
                };
            }

            return new WaterAggregationResponse() { 
                AggregationData = aggregationData.GroupBy(x => x.ReportingUnit.ReportingUnitUuid).Select(y => y.OrderBy(z => z.Amount).FirstOrDefault()).ToList(),
                MinimumAmount = aggregationData.Aggregate((curMin, x) => (curMin == null || x.Amount < curMin.Amount ? x : curMin)).Amount,
                MaximumAmount = aggregationData.Aggregate((curMin, x) => (curMin == null || x.Amount > curMin.Amount ? x : curMin)).Amount
            };
        }
    }
}
