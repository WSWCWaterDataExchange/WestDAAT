using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WestDaat.Engines;

namespace WesternStatesWater.WestDaat.Tests.EngineTests
{
    [TestClass]
    public class DtoMapperTests
    {
        [TestMethod]
        [TestCategory("Engine Tests")]
        public void DtoMapper_IsDtoMApperConfigValid()
        {
            DtoMapper.Configuration.AssertConfigurationIsValid();
        }
    }
}
