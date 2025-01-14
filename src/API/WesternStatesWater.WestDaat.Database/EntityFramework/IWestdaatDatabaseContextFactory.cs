namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public interface IWestdaatDatabaseContextFactory
    {
        public WestdaatDatabaseContext Create();
    }
}
