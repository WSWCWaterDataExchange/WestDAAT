using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapboxPrototypeAPI.Models
{
    [JsonObject(MemberSerialization.OptOut)]
    public class GeoJSON
    {
        [JsonProperty("type")]
        public string Type;

        [JsonProperty("data")]
        public GeoJSONData Data;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class GeoJSONData
    {
        [JsonProperty("type")]
        public string Type;

        [JsonProperty("features")]
        public WaterAllocation[] Features;
    }
}
