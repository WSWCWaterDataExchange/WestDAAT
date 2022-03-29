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
                .ForMember(a => a.BeneficialUses, b => b.MapFrom(c => c.AllocationBridgeBeneficialUsesFact.Select(d => d.BeneficialUse.WaDEName.Length > 0 ? d.BeneficialUse.WaDEName : d.BeneficialUseCV)))
                .ForMember(a => a.SiteIds, b => b.MapFrom(c => c.AllocationBridgeSitesFact.Select(d => d.SiteId)))
                .ForMember(a => a.OwnerClassification, b => b.MapFrom(c => c.OwnerClassification.WaDEName.Length > 0 ? c.OwnerClassification.WaDEName : c.OwnerClassificationCV))
                .ForMember(a => a.CustomerType, b => b.MapFrom(c => c.CustomerType.WaDEName.Length > 0 ? c.CustomerType.WaDEName : c.CustomerTypeCV))
                .ForMember(a => a.AllocationPriorityDate, b => b.MapFrom(c => c.AllocationPriorityDateID != null ? c.AllocationPriorityDateNavigation.Date : default(DateTime?)))
                .ForMember(a => a.AllocationFlowCfs, b => b.MapFrom(c => c.AllocationFlow_CFS))
                .ForMember(a => a.AllocationVolumeAf, b => b.MapFrom(c => c.AllocationVolume_AF))
                .ForMember(a => a.OrganizationState, b => b.MapFrom(c => c.Organization.State));
            CreateMap<EF.AllocationAmountsFact, WaterRightDetails>()
                .ForMember(dest => dest.PriorityDate, opt => opt.MapFrom(source => source.AllocationPriorityDateID.HasValue ? source.AllocationPriorityDateNavigation.Date : (DateTime?)null))
                .ForMember(dest => dest.ExpirationDate, opt => opt.MapFrom(source => source.AllocationExpirationDateID.HasValue ? source.AllocationExpirationDateNavigation.Date : (DateTime?)null))
                .ForMember(dest => dest.AllocationLegalStatus, opt => opt.MapFrom(source => source.AllocationLegalStatusCv))
                .ForMember(dest => dest.AllocationFlowCfs, opt => opt.MapFrom(source => source.AllocationFlow_CFS))
                .ForMember(dest => dest.AllocationVolumeAF, opt => opt.MapFrom(source => source.AllocationVolume_AF))
                .ForMember(dest => dest.BeneficialUses, opt => opt.MapFrom(source => source.AllocationBridgeBeneficialUsesFact.Select(a=>a.BeneficialUseCV)))
                .ForMember(dest => dest.AggregationInterval, opt => opt.MapFrom(source => source.VariableSpecific.AggregationInterval))
                .ForMember(dest => dest.AggregationIntervalUnit, opt => opt.MapFrom(source => source.VariableSpecific.AggregationIntervalUnitCv))
                .ForMember(dest => dest.AggregationStatistic, opt => opt.MapFrom(source => source.VariableSpecific.AggregationStatisticCv))
                .ForMember(dest => dest.AmountUnitCv, opt => opt.MapFrom(source => source.VariableSpecific.AmountUnitCv))
                .ForMember(dest => dest.ReportYearStartMonth, opt => opt.MapFrom(source => source.VariableSpecific.ReportYearStartMonth))
                .ForMember(dest => dest.ReportYearTypeCv, opt => opt.MapFrom(source => source.VariableSpecific.ReportYearTypeCv))
                .ForMember(dest => dest.VariableCv, opt => opt.MapFrom(source => source.VariableSpecific.VariableCv))
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(source => source.Organization.OrganizationName))
                .ForMember(dest => dest.State, opt => opt.MapFrom(source => source.Organization.State))
                .ForMember(dest => dest.OrganizationContactName, opt => opt.MapFrom(source => source.Organization.OrganizationContactName))
                .ForMember(dest => dest.OrganizationContactEmail, opt => opt.MapFrom(source => source.Organization.OrganizationContactEmail))
                .ForMember(dest => dest.OrganizationPhoneNumber, opt => opt.MapFrom(source => source.Organization.OrganizationPhoneNumber))
                .ForMember(dest => dest.OrganizationWebsite, opt => opt.MapFrom(source => source.Organization.OrganizationWebsite));
            CreateMap<EF.SitesDim, Site>()
                .ForMember(a => a.AllocationIds, b => b.MapFrom(c => c.AllocationBridgeSitesFact.Select(allocation => allocation.AllocationBridgeId)))
                .ForMember(a => a.SiteType, b => b.MapFrom(c => c.SiteTypeCvNavigation.WaDEName.Length > 0 ? c.SiteTypeCvNavigation.WaDEName : c.SiteTypeCv))
                .ForMember(a => a.Geometry, b => b.MapFrom(c => c.Geometry ?? c.SitePoint))
                .ForMember(a => a.PodPou, b => b.MapFrom(c => c.PODorPOUSite))
                .ForMember(a => a.WaterSourceTypes, b => b.MapFrom(c => c.WaterSourceBridgeSitesFact.Select(d => d.WaterSource.WaterSourceTypeCv)));
            CreateMap<EF.SitesDim, SiteInfoListItem>()
                .ForMember(dest => dest.SiteType, opt => opt.MapFrom(source => source.SiteTypeCv));
            CreateMap<EF.SitesDim, SiteLocation>();
            CreateMap<EF.OrganizationsDim, Organization>();
            CreateMap<EF.WaterSourcesDim, WaterSourceInfoListItem>()
                .ForMember(dest => dest.WaterSourceType, opt => opt.MapFrom(source => source.WaterSourceTypeCv))
                .ForMember(dest => dest.GnisfeatureName, opt => opt.MapFrom(source => source.GnisfeatureNameCv));
            CreateMap<EF.AllocationAmountsFact, WaterRightsDigest>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.AllocationAmountId))
                .ForMember(dest => dest.NativeId, opt => opt.MapFrom(source => source.AllocationNativeId))
                .ForMember(dest => dest.PriorityDate, opt => opt.MapFrom(source => source.AllocationPriorityDateNavigation.Date))
                .ForMember(dest => dest.BeneficialUses, opt => opt.MapFrom(source => source.AllocationBridgeBeneficialUsesFact.Select(a=>a.BeneficialUseCV)));
        }
    }
}
