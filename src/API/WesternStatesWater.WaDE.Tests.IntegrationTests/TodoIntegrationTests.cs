using WesternStatesWater.WaDE.Accessors;
using WesternStatesWater.WaDE.Common.DataContracts;
using WesternStatesWater.WaDE.Engines;
using WesternStatesWater.WaDE.Managers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using FluentAssertions;
using System;
using System.Linq;

namespace WesternStatesWater.WaDE.Tests.IntegrationTests
{
    [TestClass]
    public class TodoIntegrationTests : IntegrationTestBase
    {
        private TodoManager _todoManager;
        private TodoAccessor _todoAccessor;

        [TestInitialize]
        public void TestInitialize()
        {
            _todoAccessor = new TodoAccessor(CreateLogger<TodoAccessor>());
            _todoManager = new TodoManager(_todoAccessor, CreateLogger<TodoManager>());
        }

        [TestMethod]
        public void TodoManager_CreateAndList_ShouldReturnTodos()
        {
            // ARRANGE
            var preInsertTodos = _todoAccessor.FindAllTodos();
            var message1 = Guid.NewGuid().ToString();
            var message2 = Guid.NewGuid().ToString();
            var message3 = Guid.NewGuid().ToString();

            // ACT 
            _todoManager.CreateTodo(new Todo { Message = message1 });
            _todoManager.CreateTodo(new Todo { Message = message2 });
            _todoManager.CreateTodo(new Todo { Message = message3 });

            var postInsertTodos = _todoManager.FindAllTodos();

            // ASSERT 
            preInsertTodos.Should().HaveCountLessThan(postInsertTodos.Length);
            postInsertTodos.Select(todo => todo.Message).Should().Contain(message1);
            postInsertTodos.Select(todo => todo.Message).Should().Contain(message2);
            postInsertTodos.Select(todo => todo.Message).Should().Contain(message3);
        }
    }
}
