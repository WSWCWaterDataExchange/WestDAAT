using WesternStatesWater.WaDE.Common;
using WesternStatesWater.WaDE.Common.DataContracts;

namespace WesternStatesWater.WaDE.Managers
{
    public interface ITodoManager : IServiceContractBase
    {
        Todo[] FindAllTodos();

        Todo CreateTodo(Todo todo);
    }
}
