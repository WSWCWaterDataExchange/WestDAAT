using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    internal class DatabaseContextFactory : IDatabaseContextFactory
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
