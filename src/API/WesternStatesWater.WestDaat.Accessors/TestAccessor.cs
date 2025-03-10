using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class TestAccessor : AccessorBase, ITestAccessor
    {
        public TestAccessor(ILogger<TestAccessor> logger, EF.IDatabaseContextFactory databaseContextFactory) : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        private readonly EF.IDatabaseContextFactory _databaseContextFactory;

        public override string TestMe(string input)
        {
            using var db = _databaseContextFactory.Create();
            // Blow up if we can't connect to database
            db.Database.OpenConnection();
            return $"{nameof(TestAccessor)} : Database : {input}";
        }
    }


}
