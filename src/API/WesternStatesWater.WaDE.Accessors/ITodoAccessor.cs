using WesternStatesWater.WaDE.Common;
using WesternStatesWater.WaDE.Common.DataContracts;

namespace WesternStatesWater.WaDE.Accessors
{
    public interface ITodoAccessor : IServiceContractBase
    {
        Todo[] FindAllTodos();

        Todo CreateTodo(Todo todo);
    }
}
