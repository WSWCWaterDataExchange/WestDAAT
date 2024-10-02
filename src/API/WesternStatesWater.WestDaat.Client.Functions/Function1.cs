using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using WesternStatesWater.WestDaat.Contracts.Client;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class Function1 : FunctionBase
    {
        private readonly ITestManager _testManager;

        public Function1(ITestManager testManager)
        {
            _testManager = testManager;
        }

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

            var result = _testManager.TestMe("Test Me");

            return JsonResult(req, result);
        }
    }
}
