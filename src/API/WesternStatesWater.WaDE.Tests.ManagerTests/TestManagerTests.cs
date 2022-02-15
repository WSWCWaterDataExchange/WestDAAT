using WesternStatesWater.WaDE.Engines;
using WesternStatesWater.WaDE.Managers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace WesternStatesWater.WaDE.Tests.ManagerTests
{
    [TestClass]
    public class TestManagerTests : ManagerTestBase
    {
        private readonly Mock<ITestEngine> _testEngineMock = new Mock<ITestEngine>(MockBehavior.Strict);

        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestMethod]
        public void TestMe_Success()
        {
            // ARRANGE 
            _testEngineMock.Setup(x => x.TestMe(It.IsAny<string>())).Returns("hello");
            var manager = new TestManager(_testEngineMock.Object, CreateLogger<TestManager>());

            // ACT 
            var response = manager.TestMe("test test");

            // ASSERT 
            Assert.AreEqual(response, $"{nameof(TestManager)} : hello");
        }
    }
}
