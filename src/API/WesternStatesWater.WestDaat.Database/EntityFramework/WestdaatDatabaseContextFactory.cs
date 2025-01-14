using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public class WestDaatDatabaseContextFactory : IWestDaatDatabaseContextFactory
    {
        public WestDaatDatabaseContextFactory(DatabaseConfiguration configuration)
        {
            _configuration = configuration;
        }

        private readonly DatabaseConfiguration _configuration;

        WestDaatDatabaseContext IWestDaatDatabaseContextFactory.Create()
        {
            return new WestDaatDatabaseContext(_configuration);
        }
    }
}