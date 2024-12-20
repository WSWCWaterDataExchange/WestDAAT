using WesternStatesWater.WestDaat.Accessors.Mapping;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
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
