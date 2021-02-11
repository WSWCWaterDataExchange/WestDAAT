using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using MapboxPrototypeAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MapboxPrototypeAPI.Accessors
{
    class WaterAggregationAccessor : IWaterAggregationAccessor
    {
        private readonly WaDE_QA_ServerContext _dbContext;

        public WaterAggregationAccessor(WaDE_QA_ServerContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<AggregatedAmountsFact> GetAggregatedAmounts()
        {
            var aggregatedAmounts = _dbContext.AggregatedAmountsFacts
                .ToList();

            return aggregatedAmounts;
        }

        public IEnumerable<AggregatedAmountsFact> GetWaterAggregationById(WaterAggregationRequest request)
        {
            var aggregate = _dbContext.AggregatedAmountsFacts
                .Select(x => x)
                .Where(x => x.ReportingUnitId == request.Id && x.ReportYearCv == request.Year)
                .ToList();

            return aggregate;
        }
    }
}
