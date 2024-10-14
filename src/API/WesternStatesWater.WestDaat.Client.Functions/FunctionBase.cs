using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Azure.Functions.Worker.Http;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class FunctionBase
    {
        private static readonly JsonSerializerOptions JsonSerializerOptions = CreateJsonSerializerOptions();
        
        protected static async Task<HttpResponseData> JsonResult(HttpRequestData request, object obj, bool convertEnumToString = true)
        {
            var jsonResult = request.CreateResponse(HttpStatusCode.OK);
            jsonResult.Headers.Add("ContentType", "application/json");
            string jsonToReturn = null;
            jsonToReturn = convertEnumToString ? JsonSerializer.Serialize(obj, JsonSerializerOptions) : JsonSerializer.Serialize(obj);
            await jsonResult.WriteStringAsync(jsonToReturn);
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
