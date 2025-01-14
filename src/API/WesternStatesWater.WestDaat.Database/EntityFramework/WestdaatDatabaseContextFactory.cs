using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public class WestdaatDatabaseContextFactory : IWestDaatDatabaseContextFactory
    {
        public WestdaatDatabaseContextFactory(DatabaseConfiguration configuration)
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