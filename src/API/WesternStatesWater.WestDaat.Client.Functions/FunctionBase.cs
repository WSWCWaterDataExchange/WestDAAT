using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class FunctionBase
    {
        private static readonly JsonSerializerOptions _jsonSerializerOptions = CreateJsonSerializerOptions();

        public IActionResult JsonResult(object obj)
        {
            var jsonToReturn = JsonSerializer.Serialize(obj, _jsonSerializerOptions);
            return new ContentResult
            {
                Content = jsonToReturn,
                ContentType = "application/json",
                StatusCode = 200
            };
        }

        private static JsonSerializerOptions CreateJsonSerializerOptions()
        {
            var opts = new JsonSerializerOptions();
            opts.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
            return opts;
        }
    }
}
