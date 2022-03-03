using AutoMapper;
using System.Linq;
using System.Runtime.CompilerServices;
using WesternStatesWater.WestDaat.Common.DataContracts;
using EF = WesternStatesWater.WestDaat.Accessors.EntityFramework;

[assembly: InternalsVisibleTo("WesternStatesWater.WestDaat.Tests.AccessorTests")]

namespace WesternStatesWater.WestDaat.Accessors.Mapping
{
    internal class ApiProfile : Profile
    {
        public ApiProfile()
        {
            CreateMap<EF.SitesDim, Site>()
                .ForMember(s => s.AllocationIds, b => b.MapFrom(c => c.AllocationBridgeSitesFact.Select(allocation => allocation.AllocationBridgeId)))
                .ForMember(s => s.GeometryWKT, b => b.MapFrom(c => c.Geometry != null ? c.Geometry.ToString() : null));
        }
    }
}
