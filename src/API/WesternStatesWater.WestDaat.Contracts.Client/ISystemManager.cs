using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface ISystemManager : IServiceContractBase
    {
        Task<DashboardFilters> LoadFilters();

        FeatureCollection GetRiverBasinPolygonsByName(string[] basinNames);
    }
}
