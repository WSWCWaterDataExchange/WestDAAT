using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using Microsoft.Extensions.Logging;
using System.IO;
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
        private readonly ILocationEngine _locationEngine;
        private readonly ISiteAccessor _siteAccessor;
        private readonly IWaterAllocationAccessor _waterAllocationAccessor;
        private readonly INldiAccessor _nldiAccessor;
        private readonly IDocumentProcessingSdk _documentProcessingSdk;

        public WaterAllocationManager(
            INldiAccessor nldiAccessor,
            ISiteAccessor siteAccessor,
            IWaterAllocationAccessor waterAllocationAccessor,
            IGeoConnexEngine geoConnexEngine,
            ILocationEngine locationEngine,
            IDocumentProcessingSdk documentProcessingSdk,
            ILogger<WaterAllocationManager> logger) : base(logger)
        {
            _nldiAccessor = nldiAccessor;
            _siteAccessor = siteAccessor;
            _waterAllocationAccessor = waterAllocationAccessor;
            _geoConnexEngine = geoConnexEngine;
            _locationEngine = locationEngine;
            _documentProcessingSdk = documentProcessingSdk;
        }

        public async Task<ClientContracts.WaterRightsSearchResults> FindWaterRights(ClientContracts.WaterRightsSearchCriteria searchRequest)
        {
            var accessorSearchRequest = MapSearchRequest(searchRequest);

            return (await _waterAllocationAccessor.FindWaterRights(accessorSearchRequest)).Map<ClientContracts.WaterRightsSearchResults>();
        }

        private WaterRightsSearchCriteria MapSearchRequest(ClientContracts.WaterRightsSearchCriteria searchRequest)
        {
            var accessorSearchRequest = searchRequest.Map<WaterRightsSearchCriteria>();

            var geometryFilters = new List<NetTopologySuite.Geometries.Geometry>();
            if (searchRequest.RiverBasinNames?.Any() ?? false)
            {
                var featureCollection = _locationEngine.GetRiverBasinPolygonsByName(searchRequest.RiverBasinNames);
                var riverBasinPolygons = GeometryHelpers.GetGeometryByFeatures(featureCollection.Features);
                geometryFilters.AddRange(riverBasinPolygons);
            }

            if (!string.IsNullOrWhiteSpace(searchRequest.FilterGeometry))
            {
                geometryFilters.Add(GeometryHelpers.GetGeometryByGeoJson(searchRequest.FilterGeometry));
            }

            if (geometryFilters.Any())
            {
                accessorSearchRequest.FilterGeometry = geometryFilters.ToArray();
            }

            return accessorSearchRequest;
        }

        async Task<FeatureCollection> ClientContracts.IWaterAllocationManager.GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints)
        {
            return await _nldiAccessor.GetNldiFeatures(latitude, longitude, directions, dataPoints);
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

        async Task<ClientContracts.SiteDetails> ClientContracts.IWaterAllocationManager.GetSiteDetails(string siteUuid)
        {
            return (await _siteAccessor.GetSiteDetailsByUuid(siteUuid)).Map<ClientContracts.SiteDetails>();
        }

        async Task<List<ClientContracts.WaterRightsDigest>> ClientContracts.IWaterAllocationManager.GetWaterRightsDigestsBySite(string siteUuid)
        {
            return (await _waterAllocationAccessor.GetWaterRightsDigestsBySite(siteUuid)).Map<List<ClientContracts.WaterRightsDigest>>();
        }

        public async Task<Feature> GetWaterSiteLocation(string siteUuid)
        {
            var siteLocation = await _siteAccessor.GetWaterSiteLocationByUuid(siteUuid);

            Feature feature = new Feature(
                        siteLocation.Geometry?.AsGeoJsonGeometry() ?? new Point(new Position(siteLocation.Latitude.Value, siteLocation.Longitude.Value)),
                        new Dictionary<string, object> { { "siteUuid", siteLocation.SiteUuid }, { "podOrPou", siteLocation.PODorPOUSite } }
                        );

            return feature;
        }

        async Task<List<ClientContracts.WaterSourceInfoListItem>> ClientContracts.IWaterAllocationManager.GetWaterSiteSourceInfoListByUuid(string siteUuid)
        {
            return (await _siteAccessor.GetWaterSiteSourceInfoListByUuid(siteUuid)).Map<List<ClientContracts.WaterSourceInfoListItem>>();
        }

        async Task<List<ClientContracts.WaterRightInfoListItem>> ClientContracts.IWaterAllocationManager.GetWaterSiteRightsInfoListByUuid(string siteUuid)
        {
            return (await _siteAccessor.GetWaterRightInfoListByUuid(siteUuid)).Map<List<ClientContracts.WaterRightInfoListItem>>();
        }

        public async Task<Stream> WaterRightsAsZip(ClientContracts.WaterRightsSearchCriteria searchRequest)
        {
            var accessorSearchRequest = MapSearchRequest(searchRequest);
            //var count = await _waterAllocationAccessor.GetWaterRightsCount(accessorSearchRequest);

            //if (count > 100000) // return code if they are requesting more than 100k
            //{
            //    // return the function and trigger and error message for the front end saying that the requested files are more than 100.000
            //}

            return await _waterAllocationAccessor.GetWaterRightsZip(accessorSearchRequest);


            // this is more probably like
            // call database, for each search request create an enumerable of the object/file we need and push to a a list/Ienumerable then a foreach that calls the sdk to csv and get it as a list, and then we call the .toZip with that list


            // I think we will get a combination of filters, and based on these filters we would be getting a list of objects from the querys.
            // then from that list of query call the DocumentProcessing file, and have a list of the processed documents
            // then call the .zip in the document processing sdk

            // then return document, also then go to the controller and change the headers based if all of this was successfull or not

            throw new NotImplementedException();
        }
    }
}
