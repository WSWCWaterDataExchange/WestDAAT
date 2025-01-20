namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public interface IWestDaatDatabaseContextFactory
    {
        public WestDaatDatabaseContext Create();
    }
}
