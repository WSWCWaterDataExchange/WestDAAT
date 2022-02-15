using System.Linq;
using WesternStatesWater.WaDE.Common;
using WesternStatesWater.WaDE.Common.DataContracts;
using Microsoft.Extensions.Logging;
using EF = WesternStatesWater.WaDE.Accessors.EntityFramework;

namespace WesternStatesWater.WaDE.Accessors
{
    public class TodoAccessor : AccessorBase, ITodoAccessor
    {
        public TodoAccessor(ILogger<TodoAccessor> logger) : base(logger) { }
        
        public Todo[] FindAllTodos()
        {
            return UsingDatabaseContext(db =>
            {
                var todos = db.Todos.ToArray();
                var result = DTOMapper.Map<Todo[]>(todos);

                return result;
            });
        }

        public Todo CreateTodo(Todo todo)
        {
            var entity = DTOMapper.Map<EF.Todo>(todo);

            return UsingDatabaseContext(db =>
            {
                db.Todos.Add(entity);
                db.SaveChanges();

                var result = DTOMapper.Map<Todo>(entity);
                return result;
            });
        }
    }
}
