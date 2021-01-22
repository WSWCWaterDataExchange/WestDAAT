using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapboxPrototypeAPI.Accessors
{
    public interface IWaterAllocationAccessor
    {
        IEnumerable<AllocationAmountsFact> GetWaterAllocationDataById(IEnumerable<long> ids);
        IEnumerable<AllocationAmountsFact> GetAllocations();
    }
}
