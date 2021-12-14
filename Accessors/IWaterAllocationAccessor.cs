using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using MapboxPrototypeAPI.Models;
using Microsoft.Azure.WebJobs;
using System;
using System.Collections.Generic;

namespace MapboxPrototypeAPI.Accessors
{
    public interface IWaterAllocationAccessor
    {
        IEnumerable<AllocationAmountsFact> GetWaterAllocationDataById(IEnumerable<long> ids);
        IEnumerable<AllocationAmountsFact> GetAllocations();
        SitesDim GetWaterAllocationSiteDetailsById(string id);
        IEnumerable<Feature> GetBasinPolygonByNames(IEnumerable<string> basinNames, ExecutionContext context);
        IEnumerable<WaterAllocationsMetaData> GetWaterAllocationsMetaData(WaterAllocationMetaDataFilter filterValues, ExecutionContext context);
    }
}
