using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WestDaat.Accessors;

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
