using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;
using ClientContracts = WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers
{
    public sealed class WaterAllocationManager : ManagerBase, ClientContracts.IWaterAllocationManager
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

        public async Task<ClientContracts.WaterRightsSearchResults> FindWaterRights(ClientContracts.WaterRightsSearchCriteria searchRequest)
        {
            //TODO: call mapper
            var accessorSearchRequest = new WaterRightsSearchCriteria();
            //TODO: if boundaries is not null then call to convert GeoJson

            var result = await _waterAllocationAccessor.FindWaterRights(accessorSearchRequest);

            //TODO: map result

            return result;
        }

        async Task<string> ClientContracts.IWaterAllocationManager.GetWaterAllocationSiteGeoconnexIntegrationData(string siteUuid)
        {
            var site = await _siteAccessor.GetSiteByUuid(siteUuid);
            if (site.AllocationIds == null || !site.AllocationIds.Any())
            {
                throw new WestDaatException($"No AllocationAmounts found for site uuid [{siteUuid}]");
            }

            var organization = _waterAllocationAccessor.GetWaterAllocationAmountOrganizationById(site.AllocationIds.First());
            var json = _geoConnexEngine.BuildGeoConnexJson(site, organization);

            return json;
        }

        async Task<FeatureCollection> ClientContracts.IWaterAllocationManager.GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints)
        {
            return await _nldiAccessor.GetNldiFeatures(latitude, longitude, directions, dataPoints);
        }

        async Task<ClientContracts.SiteDetails> ClientContracts.IWaterAllocationManager.GetSiteDetails(string siteUuid)
        {
            return (await _siteAccessor.GetSiteDetailsByUuid(siteUuid)).Map<ClientContracts.SiteDetails>();
        }

        async Task<ClientContracts.WaterRightDetails> ClientContracts.IWaterAllocationManager.GetWaterRightDetails(long waterRightsId)
        {
            return (await _waterAllocationAccessor.GetWaterRightDetailsById(waterRightsId)).Map<ClientContracts.WaterRightDetails>();
        }

        async Task<List<ClientContracts.SiteInfoListItem>> ClientContracts.IWaterAllocationManager.GetWaterRightSiteInfoList(long waterRightsId)
        {
            return (await _waterAllocationAccessor.GetWaterRightSiteInfoById(waterRightsId)).Map<List<ClientContracts.SiteInfoListItem>>();
        }

        async Task<List<ClientContracts.WaterSourceInfoListItem>> ClientContracts.IWaterAllocationManager.GetWaterRightSourceInfoList(long waterRightsId)
        {
            return (await _waterAllocationAccessor.GetWaterRightSourceInfoById(waterRightsId)).Map<List<ClientContracts.WaterSourceInfoListItem>>();
        }

        async Task<List<ClientContracts.WaterRightsDigest>> ClientContracts.IWaterAllocationManager.GetWaterRightsDigestsBySite(string siteUuid)
        {
            return (await _waterAllocationAccessor.GetWaterRightsDigestsBySite(siteUuid)).Map<List<ClientContracts.WaterRightsDigest>>();
        }

        public async Task<FeatureCollection> GetWaterRightSiteLocations(long waterRightsId)
        {
            var siteLocations = await _waterAllocationAccessor.GetWaterRightSiteLocationsById(waterRightsId);

            List<Feature> features = new List<Feature>();

            foreach (var siteLocation in siteLocations)
            {
                features.Add(
                    new Feature(
                        siteLocation.Geometry?.AsGeoJsonGeometry() ?? new Point(new Position(siteLocation.Latitude.Value, siteLocation.Longitude.Value)),
                        new Dictionary<string, object> { { "siteUuid", siteLocation.SiteUuid }, { "podOrPou", siteLocation.PODorPOUSite } }
                        )
                    );
            }

            return new FeatureCollection(features);
        }
    }
}
