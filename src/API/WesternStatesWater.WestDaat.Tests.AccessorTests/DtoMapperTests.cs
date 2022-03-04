using WesternStatesWater.WestDaat.Accessors.Mapping;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class DtoMapperTests
    {
        [TestMethod]
        [TestCategory("Accessor Tests")]
        public void DtoMapper_IsDtoMapperConfigValid()
        {
            DtoMapper.Configuration.AssertConfigurationIsValid();
        }
    }
}
