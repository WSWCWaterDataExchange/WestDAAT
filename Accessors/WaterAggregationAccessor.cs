using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using MapboxPrototypeAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using LinqKit;

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

        public IEnumerable<AggregatedAmountsFact> GetWaterAggregationByFilterValues(WaterAggregationRequest request)
        {
            var predicate = GetAggregateDataPredicate(request);

            var aggregate = _dbContext.AggregatedAmountsFacts
                .Include(x => x.ReportingUnit)
                .Include(x => x.WaterSource)
                .Where(predicate)
                .ToList();

            return aggregate;
        }
                
        private static ExpressionStarter<AggregatedAmountsFact> GetAggregateDataPredicate(WaterAggregationRequest request)
        {
            var predicate = PredicateBuilder.New<AggregatedAmountsFact>();

            if (!string.IsNullOrWhiteSpace(request.ReportingUnitUuid))
            {
                predicate.And(x => x.ReportingUnit.ReportingUnitUuid == request.ReportingUnitUuid);
            }

            if (!string.IsNullOrWhiteSpace(request.ReportingUnitTypeCv))
            {
                predicate.And(x => x.ReportingUnit.ReportingUnitTypeCv == request.ReportingUnitTypeCv);
            }

            if (!string.IsNullOrWhiteSpace(request.ReportYearCv))
            {
                predicate.And(x => x.ReportYearCv == request.ReportYearCv);
            }

            if (!string.IsNullOrWhiteSpace(request.VariableCv))
            {
                predicate.And(x => x.VariableSpecific.VariableCv == request.VariableCv);
            }

            if (!string.IsNullOrWhiteSpace(request.WaterSourceTypeCV))
            {
                predicate.And(x => x.WaterSource.WaterSourceTypeCvNavigation.WaDename == request.WaterSourceTypeCV);
            }

            if (!string.IsNullOrWhiteSpace(request.BeneficialUseCv))
            {
                predicate.And(x => x.AggBridgeBeneficialUsesFacts.FirstOrDefault().BeneficialUseCvNavigation.WaDename == request.BeneficialUseCv);
            }

            return predicate;
        }
    }
}
