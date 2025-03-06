using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class DtoMapperTests
    {
        [TestMethod]
        public void DtoMapper_IsDtoMapperConfigValid()
        {
            DtoMapper.Configuration.AssertConfigurationIsValid();
        }
    }
}