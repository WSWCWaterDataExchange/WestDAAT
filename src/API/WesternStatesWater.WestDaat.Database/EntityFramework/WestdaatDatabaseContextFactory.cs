using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public class WestdaatDatabaseContextFactory : IWestdaatDatabaseContextFactory
    {
        public WestdaatDatabaseContextFactory(DatabaseConfiguration configuration)
        {
            _configuration = configuration;
        }

        private readonly DatabaseConfiguration _configuration;

        WestdaatDatabaseContext IWestdaatDatabaseContextFactory.Create()
        {
            return new WestdaatDatabaseContext(_configuration);
        }
    }
}