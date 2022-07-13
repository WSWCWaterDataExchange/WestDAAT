using CsvHelper;
using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.IO;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Configuration;
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
        private readonly ITemplateResourceSdk _templateResourceSdk;
        private readonly PerformanceConfiguration _performanceConfiguration;

        public WaterAllocationManager(
            INldiAccessor nldiAccessor,
            ISiteAccessor siteAccessor,
            IWaterAllocationAccessor waterAllocationAccessor,
            IGeoConnexEngine geoConnexEngine,
            ILocationEngine locationEngine,
            ITemplateResourceSdk templateResourceSdk,
            PerformanceConfiguration performanceConfiguration,
            ILogger<WaterAllocationManager> logger) : base(logger)
        {
            _nldiAccessor = nldiAccessor;
            _siteAccessor = siteAccessor;
            _waterAllocationAccessor = waterAllocationAccessor;
            _geoConnexEngine = geoConnexEngine;
            _locationEngine = locationEngine;
            _templateResourceSdk = templateResourceSdk;
            _performanceConfiguration = performanceConfiguration;
        }

        public async Task<ClientContracts.AnalyticsSummaryInformation[]> GetAnalyticsSummaryInformation(ClientContracts.WaterRightsSearchCriteria searchRequest)
        {
            var accessorSearchRequest = MapSearchRequest(searchRequest);

            return (await _waterAllocationAccessor.GetAnalyticsSummaryInformation(accessorSearchRequest)).Map<ClientContracts.AnalyticsSummaryInformation[]>();
        }

        public async Task<ClientContracts.WaterRightsSearchResults> FindWaterRights(ClientContracts.WaterRightsSearchCriteria searchRequest)
        {
            if ( searchRequest.PageNumber == null)
            {
                throw new WestDaatException($"Required value PageNumber was not found");
            }
            var accessorSearchRequest = MapSearchRequest(searchRequest);

            return (await _waterAllocationAccessor.FindWaterRights(accessorSearchRequest)).Map<ClientContracts.WaterRightsSearchResults>();
        }

        private WaterRightsSearchCriteria MapSearchRequest(ClientContracts.WaterRightsSearchCriteria searchRequest)
        {
            var accessorSearchRequest = searchRequest.Map<WaterRightsSearchCriteria>();

            var geometryFilters = new List<NetTopologySuite.Geometries.Geometry>();
            if (searchRequest?.RiverBasinNames?.Any() ?? false)
            {
                var featureCollection = _locationEngine.GetRiverBasinPolygonsByName(searchRequest.RiverBasinNames);
                var riverBasinPolygons = GeometryHelpers.GetGeometryByFeatures(featureCollection.Features);
                geometryFilters.AddRange(riverBasinPolygons);
            }

            if (searchRequest.FilterGeometry?.Length > 0)
            {
                geometryFilters.AddRange(searchRequest.FilterGeometry
                    .Select(x => GeometryHelpers.GetGeometryByGeoJson(x)));
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

        async Task<ClientContracts.WaterRightDetails> ClientContracts.IWaterAllocationManager.GetWaterRightDetails(string allocatioinUuid)
        {
            return (await _waterAllocationAccessor.GetWaterRightDetailsById(allocatioinUuid)).Map<ClientContracts.WaterRightDetails>();
        }

        async Task<List<ClientContracts.SiteInfoListItem>> ClientContracts.IWaterAllocationManager.GetWaterRightSiteInfoList(string allocationUuid)
        {
            return (await _waterAllocationAccessor.GetWaterRightSiteInfoById(allocationUuid)).Map<List<ClientContracts.SiteInfoListItem>>();
        }

        async Task<List<ClientContracts.WaterSourceInfoListItem>> ClientContracts.IWaterAllocationManager.GetWaterRightSourceInfoList(string allocationUuid)
        {
            return (await _waterAllocationAccessor.GetWaterRightSourceInfoById(allocationUuid)).Map<List<ClientContracts.WaterSourceInfoListItem>>();
        }

        public async Task<FeatureCollection> GetWaterRightSiteLocations(string allocationUuid)
        {
            var siteLocations = await _waterAllocationAccessor.GetWaterRightSiteLocationsById(allocationUuid);

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

        public async Task WaterRightsAsZip(Stream responseStream, ClientContracts.WaterRightsSearchCriteria searchRequest)
        {
            var accessorSearchRequest = MapSearchRequest(searchRequest);
            var count = await _waterAllocationAccessor.GetWaterRightsCount(accessorSearchRequest);

            if (count > _performanceConfiguration.MaxRecordsDownload)
            {
                throw new WestDaatException($"The requested amount of records exceeds the system allowance of {_performanceConfiguration.MaxRecordsDownload}");
            }

            var filesToGenerate = _waterAllocationAccessor.GetWaterRights(accessorSearchRequest);

            using (ZipOutputStream zipStream = new ZipOutputStream(responseStream))
            {
                zipStream.SetLevel(3);
                zipStream.IsStreamOwner = false;
                zipStream.UseZip64 = UseZip64.Off;

                foreach (var file in filesToGenerate)
                {
                    var ms = new MemoryStream();
                    var writer = new StreamWriter(ms);
                    var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
                    csv.Context.TypeConverterOptionsCache.GetOptions<DateTime>().Formats = new string[] { "d" };
                    csv.Context.TypeConverterOptionsCache.GetOptions<DateTime?>().Formats = new string[] { "d" };
                    csv.Context.TypeConverterOptionsCache.GetOptions<string[]>().Formats = new string[] { };
                    // write an converter options for string arrays


                    csv.WriteRecords(file);
                    csv.Flush();
                    //var entry = new ZipEntry(ZipEntry.CleanName($"{file.ElementType.Name}.csv"));
                    var entry = new ZipEntry(ZipEntry.CleanName($"{nameof(file)}.csv"));
                    zipStream.PutNextEntry(entry);

                    ms.Seek(0, SeekOrigin.Begin);

                    StreamUtils.Copy(ms, zipStream, new byte[4096]);
                }

                // getting citation file
                var citationFile = _templateResourceSdk.GetTemplate(ResourceType.Citation);
                // String replacement for the citation file
                citationFile = citationFile
                    .Replace("[insert download date here]", DateTime.Now.ToString("d"))
                    .Replace("[Insert WestDAAT URL here]", "SET URL HERE? ARE WE WORRIED ABOUT ANYTHING HERE?");

                // add the template file to the zip stream
                var memoryStream = new MemoryStream();
                var stringWriter = new StreamWriter(memoryStream);
                stringWriter.Write(citationFile.ToString());
                stringWriter.Flush();

                var citationEntry = new ZipEntry(ZipEntry.CleanName($"{nameof(citationFile)}.txt"));
                zipStream.PutNextEntry(citationEntry);

                memoryStream.Seek(0, SeekOrigin.Begin);
                StreamUtils.Copy(memoryStream, zipStream, new byte[4096]);

                zipStream.Close();
            }
        }
    }
}
