using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace MapboxPrototypeAPI.Models
{
    public class WaterAggregationResponse
    {
        [JsonProperty("MinimumAmount")]
        public double MinimumAmount { get; set; }

        [JsonProperty("MaximumAmount")]
        public double MaximumAmount { get; set; }

        [JsonProperty("AggregationData")]
        public List<AggregatedAmountsFact> AggregationData { get; set; }
    }
}
