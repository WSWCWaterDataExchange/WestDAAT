using WesternStatesWater.WaDE.Accessors;
using WesternStatesWater.WaDE.Common.DataContracts;
using WesternStatesWater.WaDE.Engines;
using WesternStatesWater.WaDE.Managers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using FluentAssertions;

namespace WesternStatesWater.WaDE.Tests.ManagerTests
{
    [TestClass]
    public class TodoManagerTests : ManagerTestBase
    {
        private readonly Mock<ITodoAccessor> _todoAccessorMock = new Mock<ITodoAccessor>(MockBehavior.Strict);
        private TodoManager _todoManager;

        [TestInitialize]
        public void TestInitialize()
        {
            _todoManager = new TodoManager(_todoAccessorMock.Object, CreateLogger<TodoManager>());
        }

        [TestMethod]
        public void TodoManager_FindAllTodos_ShouldReturnTodos()
        {
            // ARRANGE 
            _todoAccessorMock.Setup(x => x.FindAllTodos())
                .Returns(new Todo[]
                {
                    new Todo { Id = "1", Message = "First Message"},
                    new Todo { Id = "2", Message = "Second Message"},
                    new Todo { Id = "3", Message = "Third Message"},
                });

            // ACT 
            var response = _todoManager.FindAllTodos();

            // ASSERT 
            _todoAccessorMock.Verify(x => x.FindAllTodos(), Times.Once());
            response.Should().HaveCount(3);
        }
    }
}
