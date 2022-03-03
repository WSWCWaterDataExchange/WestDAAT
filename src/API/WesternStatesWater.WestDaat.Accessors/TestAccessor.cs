using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class TestAccessor : AccessorBase, ITestAccessor
    {
        public TestAccessor(ILogger<TestAccessor> logger, IDatabaseContextFactory databaseContextFactory) : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        private readonly IDatabaseContextFactory _databaseContextFactory;

        public override string TestMe(string input)
        {
            using (var db = _databaseContextFactory.Create())
            {
                // Blow up if we can't connect to database
                db.Database.OpenConnection();
                return $"{nameof(TestAccessor)} : Database : {input}";
            }
        }
    }


}
