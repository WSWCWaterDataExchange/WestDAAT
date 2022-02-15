using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WaDE.Managers;

namespace WesternStatesWater.WaDE.Tests.ManagerTests
{
    [TestClass]
    public class DTOMapperTests
    {
        [TestMethod]
        [TestCategory("Manager Tests")]
        public void DTOMapper_IsDTOMApperConfigValid()
        {
            DTOMapper.Configuration.AssertConfigurationIsValid();
        }
    }
}
