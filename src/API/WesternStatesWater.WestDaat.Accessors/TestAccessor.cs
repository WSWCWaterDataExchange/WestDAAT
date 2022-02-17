using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Data.SqlClient;

namespace WesternStatesWater.WestDaat.Accessors
{
    public class TestAccessor : AccessorBase, ITestAccessor
    {
        public TestAccessor(ILogger<TestAccessor> logger) : base(logger) { }

        public override string TestMe(string input)
        {
            return UsingDatabaseContext(db =>
            {
                // Blow up if we can't connect to database
                db.Database.OpenConnection();
                return $"{nameof(TestAccessor)} : {input}";
            });
        }
    }
}
