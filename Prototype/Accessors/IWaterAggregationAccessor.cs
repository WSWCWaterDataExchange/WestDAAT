using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using MapboxPrototypeAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapboxPrototypeAPI.Accessors
{
    public interface IWaterAggregationAccessor
    {
        IEnumerable<AggregatedAmountsFact> GetAggregatedAmounts();
        IEnumerable<AggregatedAmountsFact> GetWaterAggregationByFilterValues(WaterAggregationRequest request);
    }
}
