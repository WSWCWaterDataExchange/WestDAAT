using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class TestAccessorTests : AccessorTestBase
    {
        [TestMethod]
        [TestCategory("Accessor Tests")]
        public void TestAccessor_TestMe()
        {
            // Arrange
            var accessor = new TestAccessor(CreateLogger<TestAccessor>());

            // Act
            var result = accessor.TestMe("Unit test");

            // Assert
            result.Contains("Unit test", StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
