using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client.SmokeTest;

namespace WesternStatesWater.WestDaat.Managers
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

            return System.Text.Json.JsonSerializer.Serialize(result);
        }
    }
}
