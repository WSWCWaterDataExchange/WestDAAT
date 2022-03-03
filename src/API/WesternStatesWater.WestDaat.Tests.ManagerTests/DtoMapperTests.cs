using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class DtoMapperTests
    {
        [TestMethod]
        [TestCategory("Manager Tests")]
        public void DtoMapper_IsDtoMApperConfigValid()
        {
            DtoMapper.Configuration.AssertConfigurationIsValid();
        }
    }
}
