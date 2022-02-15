using WesternStatesWater.WaDE.Common;
using WesternStatesWater.WaDE.Contracts.Client.SmokeTest;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace WesternStatesWater.WaDE.Managers
{
    public abstract class ManagerBase : ServiceContractBase
    {
        protected ManagerBase(ILogger logger)
        {
            base.Logger = logger;
        }

        public override string TestMe(string input)
        {
            List<IServiceContractBase> engines = new List<IServiceContractBase> { };

            List<string> engineResults = new List<string>();

            engines.ForEach(engine => engineResults.Add(engine.TestMe(input)));

            List<IServiceContractBase> accessors = new List<IServiceContractBase>
            {
                //I*Accessor
            };

            List<string> accessorResults = new List<string>();

            accessors.ForEach(accessor => accessorResults.Add(accessor.TestMe(input)));

            List<string> utilityResults = new List<string>();

            List<IServiceContractBase> utilities = new List<IServiceContractBase> { };

            utilities.ForEach(utility => utilityResults.Add(utility.TestMe(input)));

            var result = new SmokeTestResult
            {
                Engines = engineResults.ToArray(),
                Manager = base.TestMe(input),
                Accessors = accessorResults.ToArray(),
                Utilities = utilityResults.ToArray()
            };

            return JsonConvert.SerializeObject(result);
        }
    }
}
