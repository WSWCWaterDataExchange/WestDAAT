using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace MapboxPrototypeAPI.Models
{
    public class WaterAllocationsMetaData
    {
        [JsonProperty("beneficialUse")]
        public string beneficialUse;

        [JsonProperty("count")]
        public int count;

        [JsonProperty("flow")]
        public double? flow;

        [JsonProperty("volume")]
        public double? volume;
    }
}
