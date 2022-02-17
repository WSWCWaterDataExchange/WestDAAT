using LinqKit;
using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using MapboxPrototypeAPI.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.Geometries.Utilities;
using NetTopologySuite.IO;
using NetTopologySuite.IO.KML;
using NetTopologySuite.Simplify;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MapboxPrototypeAPI.Accessors
{
    public class WaterAllocationAccessor : IWaterAllocationAccessor
    {
        private readonly WaDE_QA_ServerContext _dbContext;

        public WaterAllocationAccessor(WaDE_QA_ServerContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<AllocationAmountsFact> GetWaterAllocationDataById(IEnumerable<long> ids)
        {
            var allocations = _dbContext.AllocationAmountsFacts
                .Where(x => ids.Contains(x.AllocationAmountId))
                .Include(x => x.AllocationBridgeSitesFacts).ThenInclude(x => x.Site).ThenInclude(x => x.WaterSource)
                .Include(x => x.AllocationBridgeBeneficialUsesFacts).ThenInclude(x => x.BeneficialUseCvNavigation)
                .Include(x => x.Organization)
                .Include(x => x.VariableSpecific)
                .Include(x => x.AllocationExpirationDate)
                .ToList();

            foreach (var allocation in allocations)
            {
                var beneficialUse = allocation.AllocationBridgeBeneficialUsesFacts.FirstOrDefault();
                var sites = allocation.AllocationBridgeSitesFacts.Select(x => x.Site).ToList();

                foreach (var site in sites)
                {
                    if (beneficialUse == null)
                        allocation.AllocationBridgeBeneficialUsesFacts
                            .Add(new AllocationBridgeBeneficialUsesFact() { BeneficialUseCvNavigation = new BeneficialUse() { WaDename = "Unknown" } });
                }
            }

            return allocations;
        }

        public IEnumerable<AllocationAmountsFact> GetAllocations()
        {
            var allocations = _dbContext.AllocationAmountsFacts
                .Include(x => x.AllocationBridgeSitesFacts).ThenInclude(x => x.Site).ThenInclude(x => x.WaterSource).ThenInclude(x => x.WaterSourceTypeCvNavigation)
                .Include(x => x.AllocationBridgeBeneficialUsesFacts).ThenInclude(x => x.BeneficialUseCvNavigation)
                .Include(x => x.AllocationPriorityDate)
                .Where(x => !string.IsNullOrEmpty(x.OwnerClassificationCV))
                .ToList();

            foreach (var allocation in allocations)
            {
                var beneficialUse = allocation.AllocationBridgeBeneficialUsesFacts.FirstOrDefault();
                var sites = allocation.AllocationBridgeSitesFacts.Select(x => x.Site).ToList();

                foreach (var site in sites)
                {
                    if (beneficialUse == null)
                        allocation.AllocationBridgeBeneficialUsesFacts
                            .Add(new AllocationBridgeBeneficialUsesFact() { BeneficialUseCvNavigation = new BeneficialUse() { WaDename = "Unknown" } });
                }
            }

            return allocations;
        }

        public IEnumerable<Models.Feature> GetBasinPolygonByNames(IEnumerable<string> basinNames, ExecutionContext context)
        {
            var root = new Root();
            var filePath = Path.Combine(context.FunctionDirectory, "..\\RiverBasinShapes.json");

            using (StreamReader r = File.OpenText(filePath))
            {
                string json = r.ReadToEnd();
                root = JsonConvert.DeserializeObject<Root>(json);
            }
            
            var temp = root.Features.Select(x => x.Properties).Select(x => x.BasinName).ToList();
            var result = root.Features.Where(x => basinNames.Contains(x.Properties.BasinName)).ToList();

            return result;
        }

        public SitesDim GetWaterAllocationSiteDetailsById(string siteUuid)
        {
            var siteData = _dbContext.SitesDims
                .Where(x => x.SiteUuid == siteUuid)
                .Include(x => x.WaterSource)
                .Include(x => x.SiteVariableAmountsFacts)
                .Include(x => x.AllocationBridgeSitesFacts).ThenInclude(x => x.AllocationAmount).ThenInclude(x => x.Organization)
                .Include(x => x.AllocationBridgeSitesFacts).ThenInclude(x => x.AllocationAmount).ThenInclude(x => x.AllocationBridgeBeneficialUsesFacts).ThenInclude(x => x.BeneficialUseCvNavigation)
                .FirstOrDefault();

            return siteData;
        }

        public IEnumerable<WaterAllocationsMetaData> GetWaterAllocationsMetaData(WaterAllocationMetaDataFilter filterValues, ExecutionContext context)
        {
            var filterPredicate = GetMetaDataFiltersPredicate(filterValues, context);

            var allocationCounts = _dbContext.AllocationBridgeBeneficialUsesFacts
                .Where(filterPredicate)
                .Select(x => new { x.BeneficialUseCvNavigation.WaDename, x.AllocationAmount.AllocationFlowCfs, x.AllocationAmount.AllocationVolumeAf })
                .GroupBy(x => x.WaDename)
                .Select(y => new WaterAllocationsMetaData() {
                    beneficialUse = y.Key, 
                    count = y.Count(), 
                    flow = y.Sum(z => z.AllocationFlowCfs), 
                    volume = y.Sum(z => z.AllocationVolumeAf) })
                .ToList();

            return allocationCounts;
        }

        public ExpressionStarter<AllocationBridgeBeneficialUsesFact> GetMetaDataFiltersPredicate(WaterAllocationMetaDataFilter filterValues, ExecutionContext context)
        {
            var metadataPredicate = PredicateBuilder.New<AllocationBridgeBeneficialUsesFact>();

            if (filterValues.BeneficialUses.Any())
            {
                metadataPredicate
                    .And(x => filterValues.BeneficialUses.Contains(x.BeneficialUseCvNavigation.WaDename));
            }

            if (filterValues.WaterSourceType.Any())
            {
                metadataPredicate
                    .And(x => filterValues.WaterSourceType.Contains(x.AllocationAmount.AllocationBridgeSitesFacts.FirstOrDefault().Site.WaterSource.WaterSourceTypeCvNavigation.WaDename));
            }

            if (filterValues.AllocationOwnerClassification.Any())
            {
                metadataPredicate
                    .And(x => filterValues.AllocationOwnerClassification.Contains(x.AllocationAmount.OwnerClassificationCV));
            }

            if (!string.IsNullOrEmpty(filterValues.AllocationOwner))
            {
                metadataPredicate
                    .And(x => x.AllocationAmount.AllocationOwner == filterValues.AllocationOwner);
            }

            if (filterValues.StartDate != null && filterValues.EndDate != null)
            {
                metadataPredicate
                    .And(x => filterValues.StartDate <= x.AllocationAmount.AllocationPriorityDate.Date && filterValues.EndDate >= x.AllocationAmount.AllocationPriorityDate.Date);
            }

            if (filterValues.BasinNames.Any())
            {
                var basinGeometry = ParseGeoShapes(Path.Combine(context.FunctionDirectory, "..\\RiverBasinShapes.json"), filterValues.BasinNames);
                
                var simplifier = new DouglasPeuckerSimplifier(basinGeometry);
                simplifier.EnsureValidTopology = true;
                simplifier.DistanceTolerance = 0.0005;

                basinGeometry = simplifier.GetResultGeometry();

                metadataPredicate
                    .And(x => x.AllocationAmount.AllocationBridgeSitesFacts.Any(y => basinGeometry.Intersects(y.Site.SitePoint)));
            }

            return metadataPredicate;
        }

        public NetTopologySuite.Geometries.Geometry ParseGeoShapes(string filePath, List<string> basinNames)
        {
            string json;

            using (StreamReader r = File.OpenText(filePath))
            {
                json = r.ReadToEnd();
            }

            var reader = new GeoJsonReader();
            var featureCollection = reader.Read<FeatureCollection>(json);

            NetTopologySuite.Geometries.Geometry geometryResult = null;
            var shapes = new List<NetTopologySuite.Geometries.Geometry>();

            foreach (var feature in featureCollection.Where(x => basinNames.Contains(x.Attributes["BasinName"])))
            {
                foreach(var geometry in Extract(feature))
                {
                    geometryResult = geometryResult?.Union(geometry) ?? geometry;
                }
            }

            return geometryResult;
        }

        public IEnumerable<NetTopologySuite.Geometries.Geometry> Extract(IFeature feature)
        {
            var extract = new List<NetTopologySuite.Geometries.Geometry>();

            new GeometryExtracter<Point>(extract).Filter(feature.Geometry);
            new GeometryExtracter<MultiPoint>(extract).Filter(feature.Geometry);
            new GeometryExtracter<LineString>(extract).Filter(feature.Geometry);
            new GeometryExtracter<MultiLineString>(extract).Filter(feature.Geometry);
            new GeometryExtracter<LinearRing>(extract).Filter(feature.Geometry);
            new GeometryExtracter<Polygon>(extract).Filter(feature.Geometry);
            new GeometryExtracter<MultiPolygon>(extract).Filter(feature.Geometry);

            return extract;
        }
    }
}
