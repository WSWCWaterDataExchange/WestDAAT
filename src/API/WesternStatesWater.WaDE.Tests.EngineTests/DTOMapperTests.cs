using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WaDE.Engines;

namespace WesternStatesWater.WaDE.Tests.EngineTests
{
    [TestClass]
    public class DTOMapperTests
    {
        [TestMethod]
        [TestCategory("Engine Tests")]
        public void DTOMapper_IsDTOMApperConfigValid()
        {
            DTOMapper.Configuration.AssertConfigurationIsValid();
        }
    }
}
