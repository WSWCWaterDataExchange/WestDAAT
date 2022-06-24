using AutoMapper;
using System.Runtime.CompilerServices;
using WesternStatesWater.WestDaat.Accessors.CsvModels;
using EF = WesternStatesWater.WestDaat.Accessors.EntityFramework;

[assembly: InternalsVisibleTo("WesternStatesWater.WestDaat.Tests.AccessorTests")]

namespace WesternStatesWater.WestDaat.Accessors.Mapping
{
    internal class CsvProfile : Profile
    {
        public CsvProfile()
        {
            CreateMap<EF.AllocationAmountsFact, Sites>()
                .ForMember(dest => dest, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(a=>a.Site)));

            CreateMap<EF.SitesDim, Sites>()
                .ForMember(dest => dest.Regulatory, opt => opt.Ignore())
                .ForMember(dest => dest.WaterSourceUUIDs, opt => opt.Ignore())
                .ForMember(dest => dest.ID, opt => opt.Ignore())
                .ForMember(dest => dest.EPSGCodeCV, opt => opt.MapFrom(source => source.EpsgcodeCv))
                .ForMember(dest => dest.GNISCodeCV, opt => opt.MapFrom(source => source.GniscodeCv))
                .ForMember(dest => dest.SiteTypeCV, opt => opt.MapFrom(source => source.SiteTypeCv));
        }
    }
}
