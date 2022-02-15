using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WaDE.Common.DataContracts;
using System;
using WesternStatesWater.WaDE.Accessors;
using FluentAssertions;
using System.Linq;

namespace WesternStatesWater.WaDE.Tests.AccessorTests
{
    [TestClass]
    public class TodoAccessorTests : AccessorTestBase
    {
        [TestMethod]
        [TestCategory("Accessor Tests")]
        public void TodoAccessor_FindAllTodos_ShouldReturnTodos()
        {
            // Arrange
            var guidMsg = Guid.NewGuid().ToString();
            var todoAccessor = new TodoAccessor(CreateLogger<TodoAccessor>());
            todoAccessor.CreateTodo(new Todo
            {
                Message = guidMsg
            });

            // Act
            var todos = todoAccessor.FindAllTodos();

            // Assert
            todos.Should().NotBeNull();
            todos.Should().HaveCountGreaterOrEqualTo(1);

            var insertedTodo = todos.FirstOrDefault(todo => todo.Message == guidMsg);
            insertedTodo.Should().NotBeNull();
            insertedTodo.Message.Should().Be(guidMsg);
        }
    }
}
