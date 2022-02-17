using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WaDE.Common.DataContracts;
using WesternStatesWater.WaDE.Managers;
using Microsoft.AspNetCore.Authorization;

namespace WesternStatesWater.WaDE.Client.WebApi.Controllers
{
    [AllowAnonymous]
    public class TestController : ApiControllerBase
    {
        private readonly ITestManager _testManager;

        public TestController(ITestManager testManager, ILogger<TestController> logger) : base(logger)
        {
            _testManager = testManager;
        }

        public string TestMe()
        {
            // Test call
            var response = _testManager.TestMe("Test Me");

            return response;
        }
    }
}
