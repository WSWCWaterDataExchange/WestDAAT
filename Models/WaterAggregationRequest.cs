using Newtonsoft.Json;

namespace MapboxPrototypeAPI.Models
{
    public class WaterAggregationRequest
    {
        [JsonProperty("ReportingUnitUuid")]
        public string ReportingUnitUuid { get; set; }

        [JsonProperty("ReportYearCv")]
        public string ReportYearCv { get; set; }

        [JsonProperty("BeneficialUseCv")]
        public string BeneficialUseCv { get; set; }

        [JsonProperty("VariableCv")]
        public string VariableCv { get; set; }

        [JsonProperty("ReportingUnitTypeCv")]
        public string ReportingUnitTypeCv { get; set; }
    }
}
