using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;

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
            var siteDims = new SitesDimFaker().Generate(10);
            using(var db = new DatabaseContext())
            {
                db.SitesDim.AddRange(siteDims);
                db.SaveChanges();
            }

            var accessor = new SiteAccessor(CreateLogger<SiteAccessor>());
            
            // Act

            // Assert
        }
    }
}
