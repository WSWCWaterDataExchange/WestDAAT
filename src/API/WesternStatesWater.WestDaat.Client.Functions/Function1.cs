using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using Azure.Core.Serialization;
using WesternStatesWater.WestDaat.Contracts.Client;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.WestDaat.Common.Constants;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class Function1(ITestManager testManager, ILogger<Function1> logger) : FunctionBase(logger)
    {
        [Function("TestMe")]
        [OpenApiOperation("TestMe")]
        [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(string))]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)]
            HttpRequestData req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            var data = await ParseRequestBody<dynamic>(req);
            name = name ?? data?.name;

            var result = testManager.TestMe("Test Me");
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(result, new JsonObjectSerializer());
            return data;
        }

        [Function(nameof(ServiceBusTest))]
        public async Task ServiceBusTest(
            [ServiceBusTrigger(queueName: Queues.SmokeTest, Connection = "ServiceBusConnection")]
            string messageJson)
        {
            await Task.CompletedTask;
        }
    }
}