using System;
using WesternStatesWater.WestDaat.Engines;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using DC = WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Common.Exceptions;
using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Common.DataContracts;

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
                throw new WestDaatException($"No AllocationAmounts found for site uuid ${siteUuid}");
            }

            var organization = _waterAllocationAccessor.GetWaterAllocationAmountOrganizationById(site.AllocationIds.First());
            var json = _geoConnexEngine.BuildGeoConnexJson(site, organization);

            return json;
        }

        async Task<FeatureCollection> IWaterAllocationManager.GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints)
        {
            return await _nldiAccessor.GetNldiFeatures(latitude, longitude, directions, dataPoints);
        }
    }
}
