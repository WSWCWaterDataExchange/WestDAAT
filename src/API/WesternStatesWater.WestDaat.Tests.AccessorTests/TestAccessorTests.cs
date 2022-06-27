using Microsoft.Extensions.Logging.Abstractions;
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
            var accessor = new TestAccessor(NullLogger<TestAccessor>.Instance, CreateDatabaseContextFactory());

            // Act
            var result = accessor.TestMe("Unit test");

            // Assert
            result.Should().ContainEquivalentOf("Unit test");
        }
    }
}
