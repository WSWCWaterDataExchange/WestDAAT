using AutoMapper;
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
            CreateMap<EF.AllocationAmountsFact, AllocationAmount>()
                .ForMember(a => a.BeneficialUses, b => b.MapFrom(c => c.AllocationBridgeBeneficialUsesFact.Select(d => d.BeneficialUse.WaDEName)))
                .ForMember(a => a.SiteIds, b => b.MapFrom(c => c.AllocationBridgeSitesFact.Select(d => d.SiteId)))
                .ForMember(a => a.OwnerClassification, b => b.MapFrom(c => c.OwnerClassification.WaDEName))
                .ForMember(a => a.AllocationPriorityDate, b => b.MapFrom(c => c.AllocationApplicationDateNavigation != null ? c.AllocationApplicationDateNavigation.Date : default(DateTime)))
                .ForMember(a => a.AllocationFlowCfs, b => b.MapFrom(c => c.AllocationFlow_CFS))
                .ForMember(a => a.AllocationVolumeAf, b => b.MapFrom(c => c.AllocationVolume_AF))
                ;

            CreateMap<EF.SitesDim, Site>()
                .ForMember(a => a.AllocationIds, b => b.MapFrom(c => c.AllocationBridgeSitesFact.Select(allocation => allocation.AllocationBridgeId)))
                .ForMember(a => a.Geometry, b => b.MapFrom(c => c.Geometry ?? c.SitePoint))
                .ForMember(a => a.WaterSourceTypes, b => b.MapFrom(c => c.WaterSourceBridgeSitesFact.Select(d => d.WaterSource.WaterSourceTypeCv)));

            CreateMap<EF.OrganizationsDim, Organization>();
        }
    }
}
