using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WaDE.Common.DataContracts;
using WesternStatesWater.WaDE.Managers;

namespace WesternStatesWater.WaDE.Client.WebApi.Controllers
{
    public class TodoController : ApiControllerBase
    {
        private readonly ITodoManager _todoManager;

        public TodoController(ITodoManager todoManager, ILogger<TodoController> logger) : base(logger)
        {
            _todoManager = todoManager;
        }

        [HttpGet]
        public Todo[] FindAllTodos()
        {
            return _todoManager.FindAllTodos();
        }
    }
}
