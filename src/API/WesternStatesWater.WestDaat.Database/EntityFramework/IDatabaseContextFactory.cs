using WesternStatesWater.WestDaat.Database.EntityFramework.partials;

namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public interface IDatabaseContextFactory
    {
        public DatabaseContext Create();
    }
}
