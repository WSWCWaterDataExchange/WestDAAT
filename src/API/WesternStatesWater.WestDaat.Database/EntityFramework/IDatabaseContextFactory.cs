namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public interface IDatabaseContextFactory
    {
        public DatabaseContext Create();
    }
}
