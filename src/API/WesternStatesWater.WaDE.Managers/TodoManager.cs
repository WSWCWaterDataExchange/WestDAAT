using WesternStatesWater.WaDE.Accessors;
using WesternStatesWater.WaDE.Common.DataContracts;
using WesternStatesWater.WaDE.Engines;
using Microsoft.Extensions.Logging;
using System;

namespace WesternStatesWater.WaDE.Managers
{
    public class TodoManager : ManagerBase, ITodoManager
    {
        private readonly ITodoAccessor _todoAccessor;

        public TodoManager(ITodoAccessor todoAccessor, ILogger<TodoManager> logger) : base(logger)
        {
            _todoAccessor = todoAccessor;
        }

        public Todo CreateTodo(Todo todo)
        {
            return _todoAccessor.CreateTodo(todo);
        }

        public Todo[] FindAllTodos()
        {
            return _todoAccessor.FindAllTodos();
        }

        public override string TestMe(string input)
        {
            return $"{nameof(TodoManager)} : {_todoAccessor.TestMe(input)}";
        }
    }
}
