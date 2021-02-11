using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace MapboxPrototypeAPI.Models
{
    public class WaterAggregationRequest
    {
        [JsonProperty("UUID")]
        public long Id { get; set; }
        [JsonProperty("Year")]
        public string Year { get; set; }
    }
}
