using System.Text.Json;
using GeoJSON.Text.Feature;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers
{
    public sealed class WaterAllocationManager : ManagerBase, IWaterAllocationManager
    {
        private readonly IGeoConnexEngine _geoConnexEngine;
        private readonly ISiteAccessor _siteAccessor;
        private readonly IWaterAllocationAccessor _waterAllocationAccessor;
        private readonly INldiAccessor _nldiAccessor;

        public WaterAllocationManager(
            INldiAccessor nldiAccessor,
            ISiteAccessor siteAccessor,
            IWaterAllocationAccessor waterAllocationAccessor,
            IGeoConnexEngine geoConnexEngine,
            ILogger<WaterAllocationManager> logger) : base(logger)
        {
            _nldiAccessor = nldiAccessor;
            _siteAccessor = siteAccessor;
            _waterAllocationAccessor = waterAllocationAccessor;
            _geoConnexEngine = geoConnexEngine;
        }

        string IWaterAllocationManager.GetWaterAllocationSiteGeoconnexIntegrationData(string siteUuid)
        {
            var site = _siteAccessor.GetSiteByUuid(siteUuid);
            if (site.AllocationIds == null || !site.AllocationIds.Any())
            {
                throw new WestDaatException($"No AllocationAmounts found for site uuid [{siteUuid}]");
            }

            var organization = _waterAllocationAccessor.GetWaterAllocationAmountOrganizationById(site.AllocationIds.First());
            var json = _geoConnexEngine.BuildGeoConnexJson(site, organization);

            return json;
        }

        async Task<FeatureCollection> IWaterAllocationManager.GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints)
        {
            return await _nldiAccessor.GetNldiFeatures(latitude, longitude, directions, dataPoints);
        }

        async Task<string> IWaterAllocationManager.GetWaterAllocationAmountsGeoJson()
        {
            var allocations = await _waterAllocationAccessor.GetAllWaterAllocations();

            var sites = await _siteAccessor.GetSitesBySiteIds(allocations.SelectMany(a => a.SiteIds).ToList());

            var features = new List<GeoJsonFeature>();
            foreach (var allocation in allocations)
            {
                var allocationSites = sites.Where(s => allocation.SiteIds.Contains(s.SiteId));
                var feature = DtoMapper.Map<GeoJsonFeature>((allocation, allocationSites));
                features.Add(feature);
            }

            var geoJson = JsonSerializer.Serialize(features);
            return geoJson;
        }
    }
}
