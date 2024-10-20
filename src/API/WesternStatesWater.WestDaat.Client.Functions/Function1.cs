using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using Azure.Core.Serialization;
using WesternStatesWater.WestDaat.Contracts.Client;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class Function1(ITestManager testManager) : FunctionBase
    {
        [Function("TestMe")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]
            HttpRequestData req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            var result = testManager.TestMe("Test Me");
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(result, new JsonObjectSerializer());
            return data;
        }
    }
}
