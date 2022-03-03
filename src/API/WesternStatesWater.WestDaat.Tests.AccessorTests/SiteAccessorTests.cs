using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class SiteAccessorTests : AccessorTestBase
    {
        [TestMethod]
        [TestCategory("Accessor Tests")]
        public void SiteAccessor_TestMe()
        {
            // Arrange
            var accessor = new SiteAccessor(CreateLogger<SiteAccessor>());
            throw new NotImplementedException();
            
            // Act

            // Assert
        }
    }
}
