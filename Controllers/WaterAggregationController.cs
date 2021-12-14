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

            return new WaterAggregationResponse()
            {
                AggregationData = aggregationData,
                MinimumAmount = aggregationData.Aggregate((curMin, x) => (curMin == null || x.Amount < curMin.Amount ? x : curMin)).Amount,
                MaximumAmount = aggregationData.Aggregate((curMin, x) => (curMin == null || x.Amount > curMin.Amount ? x : curMin)).Amount
            };

            //return new WaterAggregationResponse() {
            //    //AggregationData = aggregationData.GroupBy(x => x.ReportingUnit.ReportingUnitUuid).Select(y => y.OrderBy(z => z.Amount).FirstOrDefault()).ToList(),
            //    AggregationData = aggregationData.GroupBy(x => x.ReportingUnit.ReportingUnitUuid).Select(y => new AggregatedAmountsFact {
            //        AggregatedAmountId = y.FirstOrDefault().AggregatedAmountId ,
            //        OrganizationId = y.FirstOrDefault().OrganizationId,
            //        ReportingUnitId = y.FirstOrDefault().ReportingUnitId,
            //        VariableSpecificId = y.FirstOrDefault().VariableSpecificId,
            //        PrimaryUseCategoryCv = y.FirstOrDefault().PrimaryUseCategoryCv,
            //        WaterSourceId = y.FirstOrDefault().WaterSourceId,
            //        MethodId = y.FirstOrDefault().MethodId,
            //        TimeframeStartId = y.FirstOrDefault().TimeframeStartId,
            //        TimeframeEndId = y.FirstOrDefault().TimeframeEndId,
            //        DataPublicationDateId = y.FirstOrDefault().DataPublicationDateId,
            //        DataPublicationDoi = y.FirstOrDefault().DataPublicationDoi,
            //        ReportYearCv = y.FirstOrDefault().ReportYearCv,
            //        Amount = y.Sum(z => z.Amount),
            //        PopulationServed = y.FirstOrDefault().PopulationServed,
            //        PowerGeneratedGwh = y.FirstOrDefault().PowerGeneratedGwh,
            //        IrrigatedAcreage = y.FirstOrDefault().IrrigatedAcreage,
            //        InterbasinTransferToId = y.FirstOrDefault().InterbasinTransferToId,
            //        InterbasinTransferFromId = y.FirstOrDefault().InterbasinTransferFromId,
            //        CropTypeCv = y.FirstOrDefault().CropTypeCv,
            //        IrrigationMethodCv = y.FirstOrDefault().IrrigationMethodCv,
            //        CustomerTypeCv = y.FirstOrDefault().CustomerTypeCv,
            //        SdwisidentifierCv = y.FirstOrDefault().SdwisidentifierCv,
            //        CommunityWaterSupplySystem = y.FirstOrDefault().CommunityWaterSupplySystem,
            //        AllocationCropDutyAmount = y.FirstOrDefault().AllocationCropDutyAmount,
            //        PowerType = y.FirstOrDefault().PowerType,
            //        CropTypeCvNavigation = y.FirstOrDefault().CropTypeCvNavigation,
            //        CustomerTypeCvNavigation = y.FirstOrDefault().CustomerTypeCvNavigation,
            //        DataPublicationDate = y.FirstOrDefault().DataPublicationDate,
            //        IrrigationMethodCvNavigation = y.FirstOrDefault().IrrigationMethodCvNavigation,
            //        Method = y.FirstOrDefault().Method,
            //        Organization = y.FirstOrDefault().Organization,
            //        PowerTypeNavigation = y.FirstOrDefault().PowerTypeNavigation,
            //        PrimaryUseCategoryCvNavigation = y.FirstOrDefault().PrimaryUseCategoryCvNavigation,
            //        ReportYearCvNavigation = y.FirstOrDefault().ReportYearCvNavigation,
            //        ReportingUnit = y.FirstOrDefault().ReportingUnit,
            //        SdwisidentifierCvNavigation = y.FirstOrDefault().SdwisidentifierCvNavigation,
            //        TimeframeEnd = y.FirstOrDefault().TimeframeEnd,
            //        TimeframeStart = y.FirstOrDefault().TimeframeStart,
            //        VariableSpecific = y.FirstOrDefault().VariableSpecific,
            //        WaterSource = y.FirstOrDefault().WaterSource,
            //        AggBridgeBeneficialUsesFacts = y.FirstOrDefault().AggBridgeBeneficialUsesFacts,
            //    }).ToList(),
            //    MinimumAmount = aggregationData.Aggregate((curMin, x) => (curMin == null || x.Amount < curMin.Amount ? x : curMin)).Amount,
            //    MaximumAmount = aggregationData.Aggregate((curMin, x) => (curMin == null || x.Amount > curMin.Amount ? x : curMin)).Amount
            //};
        }
    }
}
