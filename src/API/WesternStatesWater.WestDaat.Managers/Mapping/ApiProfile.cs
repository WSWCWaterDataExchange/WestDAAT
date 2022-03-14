using AutoMapper;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Mapping
{
    internal class ApiProfile : Profile
    {
        public ApiProfile()
        {
            // {BU: site.Allocations.SelectMany(BU).Distrinct()}

            CreateMap<(AllocationAmount allocation, IEnumerable<Site> sites), GeoJsonFeature>()
                .ForMember(a => a.Geometry, b => b.MapFrom(c => new GeoJsonGeometry
                {
                    Type = "Point",
                    Coordinates = new double[]
                    {
                        c.sites.FirstOrDefault().Longitude ?? 0,
                        c.sites.FirstOrDefault().Latitude ?? 0,
                    }
                }))
                .ForMember(a => a.Properties, b => b.MapFrom(c => new Dictionary<string, object>
                {
                    {"allocationId", c.allocation.AllocationAmountId},
                    {"allocationFlowCfs", c.allocation.AllocationFlowCfs ?? 0},
                    {"allocationVolumeAf", c.allocation.AllocationVolumeAf ?? 0},
                    {"allocationOwner", c.allocation.AllocationOwner},
                    {"ownerClassification", c.allocation.OwnerClassification},
                    {"beneficialUses", c.allocation.BeneficialUses},
                    {"allocationPriorityDate", (c.allocation.AllocationPriorityDate - new DateTime(1970, 1, 1)).TotalMilliseconds},
                    {"siteUuid", c.sites.FirstOrDefault().SiteUuid},
                    {"siteName", c.sites.FirstOrDefault().SiteName},
                    {"waterSourceTypes", string.Join(',', c.sites.SelectMany(d => d.WaterSourceTypes).Distinct())},
                }));
        }
    }
}