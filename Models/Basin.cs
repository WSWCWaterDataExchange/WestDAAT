using Newtonsoft.Json;
using System.Collections.Generic;

namespace MapboxPrototypeAPI.Models
{
    [JsonObject(MemberSerialization.OptOut)]
    public class Geometry
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("coordinates")]
        public List<List<List<double>>> Coordinates { get; set; }
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class Properties
    {
        [JsonProperty("BasinName")]
        public string BasinName { get; set; }

        [JsonProperty("Shape_Leng")]
        public double ShapeLeng { get; set; }

        [JsonProperty("Shape_Area")]
        public double ShapeArea { get; set; }
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class Feature
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("geometry")]
        public Geometry Geometry { get; set; }

        [JsonProperty("properties")]
        public Properties Properties { get; set; }
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class Root
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("features")]
        public List<Feature> Features { get; set; }
    }
}
