using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Database.EntityFramework.partials;

namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public class DatabaseContextFactory : IDatabaseContextFactory
    {
        public DatabaseContextFactory(DatabaseConfiguration configuration)
        {
            _configuration = configuration;
        }

        private readonly DatabaseConfiguration _configuration;

        DatabaseContext IDatabaseContextFactory.Create()
        {
            return new DatabaseContext(_configuration);
        }
    }
}
