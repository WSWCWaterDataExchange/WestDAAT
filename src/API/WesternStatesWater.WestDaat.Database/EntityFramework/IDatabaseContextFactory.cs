namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public interface IDatabaseContextFactory
    {
        public DatabaseContext Create();
    }
}
