using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Azure.Functions.Worker.Http;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class FunctionBase
    {
        private static readonly JsonSerializerOptions _jsonSerializerOptions = CreateJsonSerializerOptions();

        public HttpResponseData JsonResult(HttpRequestData request, object obj)
        {
            var jsonResult = request.CreateResponse(HttpStatusCode.OK);
            jsonResult.Headers.Add("ContentType", "application/json");
            var jsonToReturn = JsonSerializer.Serialize(obj, _jsonSerializerOptions);
            jsonResult.WriteString(jsonToReturn);
            return jsonResult;
        }

        private static JsonSerializerOptions CreateJsonSerializerOptions()
        {
            var opts = new JsonSerializerOptions();
            opts.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
            return opts;
        }
    }
}
