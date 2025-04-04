using CsvHelper;
using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IO;
using System.Reflection;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Handlers;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;
using ClientContracts = WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers
{
    public sealed class WaterResourceManager : ManagerBase, ClientContracts.IWaterResourceManager
    {
        private readonly IGeoConnexEngine _geoConnexEngine;
        private readonly ILocationEngine _locationEngine;
        private readonly ISiteAccessor _siteAccessor;
        private readonly ISystemAccessor _systemAccessor;
        private readonly IWaterAllocationAccessor _waterAllocationAccessor;
        private readonly INldiAccessor _nldiAccessor;
        private readonly ITemplateResourceSdk _templateResourceSdk;
        private readonly PerformanceConfiguration _performanceConfiguration;

        public WaterResourceManager(
            INldiAccessor nldiAccessor,
            ISiteAccessor siteAccessor,
            ISystemAccessor systemAccessor,
            IWaterAllocationAccessor waterAllocationAccessor,
            IGeoConnexEngine geoConnexEngine,
            ILocationEngine locationEngine,
            IValidationEngine validationEngine,
            ITemplateResourceSdk templateResourceSdk,
            PerformanceConfiguration performanceConfiguration,
            IManagerRequestHandlerResolver resolver,
            ILogger<WaterResourceManager> logger) : base(resolver, validationEngine, logger)
        {
            _nldiAccessor = nldiAccessor;
            _siteAccessor = siteAccessor;
            _systemAccessor = systemAccessor;
            _waterAllocationAccessor = waterAllocationAccessor;
            _geoConnexEngine = geoConnexEngine;
            _locationEngine = locationEngine;
            _templateResourceSdk = templateResourceSdk;
            _performanceConfiguration = performanceConfiguration;
        }

        async Task<ClientContracts.AnalyticsSummaryInformationResponse> ClientContracts.IWaterResourceManager.GetAnalyticsSummaryInformation(ClientContracts.WaterRightsSearchCriteriaWithGrouping searchRequest)
        {
            var accessorSearchRequest = MapSearchRequest(searchRequest);

            var groupValue = searchRequest.GroupValue ?? AnalyticsInformationGrouping.BeneficialUse;

            var result = await _waterAllocationAccessor.GetAnalyticsSummaryInformation(accessorSearchRequest, groupValue);
            var clientResult = result.Map<ClientContracts.AnalyticsSummaryInformation[]>();

            var dropdownOptions = BuildEnumGroupItems<AnalyticsInformationGrouping>();

            return new ClientContracts.AnalyticsSummaryInformationResponse
            {
                AnalyticsSummaryInformation = clientResult,
                GroupItems = dropdownOptions,
                GroupValue = (int)groupValue
            };
        }

        private ClientContracts.GroupItem[] BuildEnumGroupItems<T>() where T : Enum
        {
            var enumValues = typeof(T).GetEnumValues() as T[];
            var enumValuesAndDisplayAttributes = enumValues
                .Select(enumValue => new
                {
                    Value = (int)(object)enumValue,
                    DisplayAttribute = enumValue.GetType().GetMember(enumValue.ToString())[0].GetCustomAttribute<DisplayAttribute>()
                }).ToArray();

            return enumValuesAndDisplayAttributes
                .Where(obj => obj.DisplayAttribute is not null)
                .Select(obj => new ClientContracts.GroupItem
                {
                    Value = obj.Value,
                    Label = obj.DisplayAttribute.Name
                }).ToArray();
        }

        async Task<FeatureCollection> ClientContracts.IWaterResourceManager.GetWaterRightsEnvelope(ClientContracts.WaterRightsSearchCriteria searchRequest)
        {
            var accessorSearchRequest = MapSearchRequest(searchRequest);

            var geometry = await _waterAllocationAccessor.GetWaterRightsEnvelope(accessorSearchRequest);
            var features = new List<Feature>();
            if (geometry != null)
            {
                features.Add(new Feature(geometry.AsGeoJsonGeometry()));
            }

            return new FeatureCollection(features);
        }

        async Task<ClientContracts.WaterRightsSearchResults> ClientContracts.IWaterResourceManager.FindWaterRights(ClientContracts.WaterRightsSearchCriteriaWithPaging searchRequest)
        {
            var accessorSearchRequest = MapSearchRequest(searchRequest);

            return (await _waterAllocationAccessor.FindWaterRights(accessorSearchRequest, searchRequest.PageNumber)).Map<ClientContracts.WaterRightsSearchResults>();
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

        async Task<FeatureCollection> ClientContracts.IWaterResourceManager.GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints)
        {
            return await _nldiAccessor.GetNldiFeatures(latitude, longitude, directions, dataPoints);
        }

        async Task<ClientContracts.WaterRightDetails> ClientContracts.IWaterResourceManager.GetWaterRightDetails(string allocatioinUuid)
        {
            return (await _waterAllocationAccessor.GetWaterRightDetailsById(allocatioinUuid)).Map<ClientContracts.WaterRightDetails>();
        }

        async Task<List<ClientContracts.SiteInfoListItem>> ClientContracts.IWaterResourceManager.GetWaterRightSiteInfoList(string allocationUuid)
        {
            return (await _waterAllocationAccessor.GetWaterRightSiteInfoById(allocationUuid)).Map<List<ClientContracts.SiteInfoListItem>>();
        }
        
        async Task<List<ClientContracts.SiteUsageListItem>> ClientContracts.IWaterResourceManager.GetRightUsageInfoListByAllocationUuid(string allocationUuid)
        {
            var siteUsageTableEntries = await _waterAllocationAccessor.GetRightUsageInfoListByAllocationUuid(allocationUuid);
            return siteUsageTableEntries.Map<List<ClientContracts.SiteUsageListItem>>();
        }

        async Task<List<ClientContracts.WaterSourceInfoListItem>> ClientContracts.IWaterResourceManager.GetWaterRightSourceInfoList(string allocationUuid)
        {
            return (await _waterAllocationAccessor.GetWaterRightSourceInfoById(allocationUuid)).Map<List<ClientContracts.WaterSourceInfoListItem>>();
        }

        async Task<FeatureCollection> ClientContracts.IWaterResourceManager.GetWaterRightSiteLocations(string allocationUuid)
        {
            var siteLocations = await _waterAllocationAccessor.GetWaterRightSiteLocationsById(allocationUuid);

            List<Feature> features = new List<Feature>();

            foreach (var siteLocation in siteLocations)
            {
                features.Add(
                    new Feature(
                        siteLocation.Geometry?.AsGeoJsonGeometry() ?? new Point(new Position(siteLocation.Latitude.Value, siteLocation.Longitude.Value)),
                        new Dictionary<string, object> { { "uuid", siteLocation.SiteUuid }, { "podOrPou", siteLocation.PODorPOUSite } }
                    )
                );
            }

            return new FeatureCollection(features);
        }

        async Task<ClientContracts.OverlayDetails> ClientContracts.IWaterResourceManager.GetOverlayDetails(string overlayUuid)
        {
            if (string.IsNullOrWhiteSpace(overlayUuid))
            {
                throw new WestDaatException("OverlayDetails UUID cannot be null or empty.");
            }

            var overlayCommon = await _waterAllocationAccessor.GetOverlayDetails(overlayUuid);

            if (overlayCommon == null)
            {
                throw new WestDaatException($"No overlay found for UUID: {overlayUuid}");
            }

            var geoJsonGeometry = overlayCommon.Geometry?.AsGeoJsonGeometry();

            Feature geometryFeature = null;
            if (geoJsonGeometry != null)
            {
                geometryFeature = new Feature(geoJsonGeometry);
            }

            var overlayClient = overlayCommon.Map<ClientContracts.OverlayDetails>();

            var featureCollection = new FeatureCollection();
            if (geometryFeature != null)
            {
                featureCollection.Features.Add(geometryFeature);
            }

            overlayClient.Geometry = featureCollection;

            return overlayClient;
        }

        async Task<List<ClientContracts.OverlayTableEntry>> ClientContracts.IWaterResourceManager.GetOverlayInfoById(ClientContracts.OverlayDetailsSearchCriteria searchCriteria)
        {
            var searchCriteriaFields = new[] { searchCriteria.ReportingUnitUUID, searchCriteria.AllocationUUID };
            if (searchCriteriaFields.Select(string.IsNullOrWhiteSpace).Count(@bool => @bool) != 1)
            {
                throw new WestDaatException("Only one search criteria field should be non-empty");
            }

            var request = searchCriteria.Map<OverlayDetailsSearchCriteria>();
            var overlayEntries = await _waterAllocationAccessor.GetOverlayInfoById(request);

            return overlayEntries.Map<List<ClientContracts.OverlayTableEntry>>();
        }

        async Task<string> ClientContracts.IWaterResourceManager.GetWaterAllocationSiteGeoconnexIntegrationData(string siteUuid)
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

        async Task<ClientContracts.SiteDetails> ClientContracts.IWaterResourceManager.GetSiteDetails(string siteUuid)
        {
            return (await _siteAccessor.GetSiteDetailsByUuid(siteUuid)).Map<ClientContracts.SiteDetails>();
        }

        async Task<ClientContracts.SiteDigest> ClientContracts.IWaterResourceManager.GetSiteDigest(string siteUuid)
        {
            return (await _siteAccessor.GetSiteDigestByUuid(siteUuid)).Map<ClientContracts.SiteDigest>();
        }
        
        async Task<List<ClientContracts.OverlayDigest>> ClientContracts.IWaterResourceManager.GetOverlayDigestsByUuid(string siteUuid)
        {
            return (await _waterAllocationAccessor.GetOverlayDigestsByUuid(siteUuid)).Map<List<ClientContracts.OverlayDigest>>();
        }

        async Task<Feature> ClientContracts.IWaterResourceManager.GetWaterSiteLocation(string siteUuid)
        {
            var siteLocation = await _siteAccessor.GetWaterSiteLocationByUuid(siteUuid);

            Feature feature = new Feature(
                siteLocation.Geometry?.AsGeoJsonGeometry() ?? new Point(new Position(siteLocation.Latitude.Value, siteLocation.Longitude.Value)),
                new Dictionary<string, object> { { "uuid", siteLocation.SiteUuid }, { "podOrPou", siteLocation.PODorPOUSite } }
            );

            return feature;
        }

        async Task<List<ClientContracts.WaterSourceInfoListItem>> ClientContracts.IWaterResourceManager.GetWaterSiteSourceInfoListByUuid(string siteUuid)
        {
            return (await _siteAccessor.GetWaterSiteSourceInfoListByUuid(siteUuid)).Map<List<ClientContracts.WaterSourceInfoListItem>>();
        }

        async Task<List<ClientContracts.WaterRightInfoListItem>> ClientContracts.IWaterResourceManager.GetWaterSiteRightsInfoListByUuid(string siteUuid)
        {
            return (await _siteAccessor.GetWaterRightInfoListByUuid(siteUuid)).Map<List<ClientContracts.WaterRightInfoListItem>>();
        }

        async Task<List<ClientContracts.WaterRightInfoListItem>> ClientContracts.IWaterResourceManager.GetWaterRightsInfoListByReportingUnitUuid(string reportingUnitUuid)
        {
            return (await _siteAccessor.GetWaterRightInfoListByReportingUnitUuid(reportingUnitUuid))
                .Map<List<ClientContracts.WaterRightInfoListItem>>();
        }

        async Task<ClientContracts.SiteUsage> ClientContracts.IWaterResourceManager.GetSiteUsageBySiteUuid(string siteUuid)
        {
            var siteUsagePoints = await _siteAccessor.GetSiteUsageBySiteUuid(siteUuid);
            return new ClientContracts.SiteUsage
            {
                AmountUnit = siteUsagePoints.FirstOrDefault()?.AmountUnit,
                SiteUsagePoints = siteUsagePoints.Map<List<ClientContracts.SiteUsagePoint>>()
            };
        }
        
        async Task<List<ClientContracts.SiteUsageListItem>> ClientContracts.IWaterResourceManager.GetSiteUsageInfoListBySiteUuid(string siteUuid)
        {
            var siteUsageTableEntries = await _siteAccessor.GetSiteUsageInfoListBySiteUuid(siteUuid);
            return siteUsageTableEntries.Map<List<ClientContracts.SiteUsageListItem>>();
        }


        async Task<List<ClientContracts.VariableInfoListItem>> ClientContracts.IWaterResourceManager.GetSiteVariableInfoListByUuid(string siteUuid)
        {
            return (await _siteAccessor.GetVariableInfoListByUuid(siteUuid)).Map<List<ClientContracts.VariableInfoListItem>>();
        }

        async Task<List<ClientContracts.MethodInfoListItem>> ClientContracts.IWaterResourceManager.GetSiteMethodInfoListByUuid(string siteUuid)
        {
            return (await _siteAccessor.GetMethodInfoListByUuid(siteUuid)).Map<List<ClientContracts.MethodInfoListItem>>();
        }

        async Task ClientContracts.IWaterResourceManager.WaterRightsAsZip(Stream responseStream, ClientContracts.WaterRightsSearchCriteriaWithFilterUrl searchRequest)
        {
            var accessorSearchRequest = MapSearchRequest(searchRequest);

            var count = _waterAllocationAccessor.GetWaterRightsCount(accessorSearchRequest);

            if (count > _performanceConfiguration.MaxRecordsDownload)
            {
                throw new WestDaatException($"The requested amount of records exceeds the system allowance of {_performanceConfiguration.MaxRecordsDownload}");
            }

            var filesToGenerate = _waterAllocationAccessor.GetWaterRights(accessorSearchRequest);

            using (ZipOutputStream zipStream = new ZipOutputStream(responseStream))
            {
                zipStream.SetLevel(9);
                zipStream.IsStreamOwner = false;

                Parallel.ForEach(filesToGenerate, file =>
                {
                    var ms = new MemoryStream();
                    var writer = new StreamWriter(ms);
                    var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
                    if (file.Data.Any())
                    {
                        csv.Context.TypeConverterOptionsCache.GetOptions<DateTime>().Formats = new string[] { "d" };
                        csv.Context.TypeConverterOptionsCache.GetOptions<DateTime?>().Formats = new string[] { "d" };

                        csv.WriteRecords(file.Data);
                        csv.Flush();
                    }
                    else
                    {
                        csv.WriteField($"No Data found for {file.Name}");
                        csv.Flush();
                    }

                    lock (filesToGenerate)
                    {
                        var entry = new ZipEntry(ZipEntry.CleanName($"{file.Name}.csv"));
                        zipStream.PutNextEntry(entry);

                        ms.Seek(0, SeekOrigin.Begin);

                        StreamUtils.Copy(ms, zipStream, new byte[4096]);
                    }
                });

                // getting citation file
                var citationFile = _templateResourceSdk.GetTemplate(ResourceType.Citation);
                // String replacement for the citation file
                citationFile = citationFile
                    .Replace("[insert download date here]", DateTime.Now.ToString("d"))
                    .Replace("[Insert WestDAAT URL here]", $"{searchRequest.FilterUrl}");


                // add the citation file to the zip stream
                var memoryStream = new MemoryStream();
                var stringWriter = new StreamWriter(memoryStream);
                stringWriter.Write(citationFile.ToString());
                stringWriter.Flush();

                var citationEntry = new ZipEntry(ZipEntry.CleanName("citation.txt"));
                zipStream.PutNextEntry(citationEntry);

                memoryStream.Seek(0, SeekOrigin.Begin);
                StreamUtils.Copy(memoryStream, zipStream, new byte[4096]);

                zipStream.Close();

                await Task.CompletedTask;
            }
        }

        async Task<ClientContracts.DashboardFilters> ClientContracts.IWaterResourceManager.LoadFilters()
        {
            return (await _systemAccessor.LoadFilters()).Map<ClientContracts.DashboardFilters>();
        }

        FeatureCollection ClientContracts.IWaterResourceManager.GetRiverBasinPolygonsByName(string[] basinNames)
        {
            return _locationEngine.GetRiverBasinPolygonsByName(basinNames);
        }
    }
}