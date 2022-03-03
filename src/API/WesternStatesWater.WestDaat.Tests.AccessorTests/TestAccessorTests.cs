using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Common.Configuration;

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
            var accessor = new TestAccessor(NullLogger<TestAccessor>.Instance, CreateDatabaseContextFactory());

            // Act
            var result = accessor.TestMe("Unit test");

            // Assert
            result.Should().ContainEquivalentOf("Unit test");
        }
    }
}
