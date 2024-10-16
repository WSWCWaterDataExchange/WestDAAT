using Microsoft.EntityFrameworkCore;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Accessors.Extensions;

public static class EntityExtensions
{
    public static Task<string[]> GetControlledVocabularyNames<TCv>(this DbSet<TCv> table) where TCv : ControlledVocabularyBase
    {
        return table
            .AsNoTracking()
            .Select(a => a.WaDEName.Length > 0 ? a.WaDEName : a.Name)
            .Distinct()
            .OrderBy(a => a)
            .ToArrayAsync();
    }
}