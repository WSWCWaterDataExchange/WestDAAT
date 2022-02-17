using Newtonsoft.Json;

namespace WesternStatesWater.WestDaat.Contracts.Client.SmokeTest
{
    [JsonObject]
    public class SmokeTestResult
    {
        [JsonProperty]
        public string Manager { get; set; }

        [JsonProperty]
        public string[] Engines { get; set; }

        [JsonProperty]
        public string[] Accessors { get; set; }

        [JsonProperty]
        public string[] Utilities { get; set; }
    }

    [JsonObject]
    public class TokenResult
    {
        [JsonProperty("data")]
        public Token Data { get; set; }
    }

    [JsonObject]
    public class Token
    {
        [JsonProperty("token")]
        public string TokenValue { get; set; }
    }
}
