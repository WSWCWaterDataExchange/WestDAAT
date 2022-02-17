using WesternStatesWater.WestDaat.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class Function1
    {
        private readonly ITestManager _testManager;

        public Function1(ITestManager testManager)
        {
            _testManager = testManager;
        }

        [FunctionName("TestMe")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            var result = _testManager.TestMe("Function app");

            return new OkObjectResult(result);
        }
    }
}
