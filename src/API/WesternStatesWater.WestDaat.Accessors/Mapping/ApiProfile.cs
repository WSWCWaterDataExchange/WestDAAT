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
                .ForMember(dest => dest.PriorityDate, opt => opt.MapFrom(source => source.AllocationPriorityDateNavigation.Date))
                .ForMember(dest => dest.ExpirationDate, opt => opt.MapFrom(source => source.AllocationExpirationDateNavigation.Date))
                .ForMember(dest => dest.AllocationLegalStatus, opt => opt.MapFrom(source => source.AllocationLegalStatusCv))
                .ForMember(dest => dest.AllocationFlowCfs, opt => opt.MapFrom(source => source.AllocationFlow_CFS))
                .ForMember(dest => dest.AllocationVolumeAF, opt => opt.MapFrom(source => source.AllocationVolume_AF))
                .ForMember(dest => dest.BeneficialUses, opt => opt.MapFrom(source => source.AllocationBridgeBeneficialUsesFact.Select(a => a.BeneficialUseCV)))
                .ForMember(dest => dest.AllocationOwner, opt => opt.MapFrom(source => source.AllocationOwner))
                .ForMember(dest => dest.AggregationInterval, opt => opt.MapFrom(source => source.VariableSpecific.AggregationInterval))
                .ForMember(dest => dest.AggregationIntervalUnit, opt => opt.MapFrom(source => source.VariableSpecific.AggregationIntervalUnitCv))
                .ForMember(dest => dest.AggregationStatistic, opt => opt.MapFrom(source => source.VariableSpecific.AggregationStatisticCv))
                .ForMember(dest => dest.AmountUnitCv, opt => opt.MapFrom(source => source.VariableSpecific.AmountUnitCv))
                .ForMember(dest => dest.ReportYearStartMonth, opt => opt.MapFrom(source => source.VariableSpecific.ReportYearStartMonth))
                .ForMember(dest => dest.ReportYearTypeCv, opt => opt.MapFrom(source => source.VariableSpecific.ReportYearTypeCv))
                .ForMember(dest => dest.VariableCv, opt => opt.MapFrom(source => source.VariableSpecific.VariableCv))
                .ForMember(dest => dest.VariableSpecific, opt => opt.MapFrom(source => source.VariableSpecific.VariableSpecificCv))
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(source => source.Organization.OrganizationName))
                .ForMember(dest => dest.State, opt => opt.MapFrom(source => source.Organization.State))
                .ForMember(dest => dest.OrganizationWebsite, opt => opt.MapFrom(source => source.Organization.OrganizationWebsite))
                .ForMember(dest => dest.MethodType, opt => opt.MapFrom(source => source.Method.MethodTypeCv))
                .ForMember(dest => dest.MethodLink, opt => opt.MapFrom(source => source.Method.MethodNemilink))
                .ForMember(dest => dest.MethodDescription, opt => opt.MapFrom(source => source.Method.MethodDescription))
                .ForMember(dest => dest.ApplicableResourceType, opt => opt.MapFrom(source => source.Method.ApplicableResourceTypeCv));
            CreateMap<EF.AllocationAmountsFact, WaterRightInfoListItem>()
                .ForMember(dest => dest.WaterRightId, opt => opt.MapFrom(source => source.AllocationAmountId))
                .ForMember(dest => dest.Volume, opt => opt.MapFrom(source => source.AllocationVolume_AF))
                .ForMember(dest => dest.Flow, opt => opt.MapFrom(source => source.AllocationFlow_CFS))
                .ForMember(dest => dest.WaterRightNativeId, opt => opt.MapFrom(source => source.AllocationNativeId))
                .ForMember(dest => dest.Owner, opt => opt.MapFrom(source => source.AllocationOwner))
                .ForMember(dest => dest.LegalStatus, opt => opt.MapFrom(source => source.AllocationLegalStatusCv))
                .ForMember(dest => dest.BeneficialUses, opt => opt.MapFrom(source => source.AllocationBridgeBeneficialUsesFact.Select(a => a.BeneficialUseCV)))
                .ForMember(dest => dest.PriorityDate, opt => opt.MapFrom(source => source.AllocationPriorityDateNavigation.Date))
                .ForMember(dest => dest.ExpirationDate, opt => opt.MapFrom(source => source.AllocationExpirationDateNavigation.Date));
            CreateMap<EF.SitesDim, Site>()
                .ForMember(a => a.AllocationIds, b => b.MapFrom(c => c.AllocationBridgeSitesFact.Select(allocation => allocation.AllocationBridgeId)))
                .ForMember(a => a.SiteType, b => b.MapFrom(c => c.SiteTypeCvNavigation.WaDEName.Length > 0 ? c.SiteTypeCvNavigation.WaDEName : c.SiteTypeCv))
                .ForMember(a => a.Geometry, b => b.MapFrom(c => c.Geometry ?? c.SitePoint))
                .ForMember(a => a.PodPou, b => b.MapFrom(c => c.PODorPOUSite))
                .ForMember(a => a.WaterSourceTypes, b => b.MapFrom(c => c.WaterSourceBridgeSitesFact.Select(d => d.WaterSource.WaterSourceTypeCv)));
            CreateMap<EF.SitesDim, SiteInfoListItem>()
                .ForMember(dest => dest.SiteType, opt => opt.MapFrom(source => source.SiteTypeCv));
            CreateMap<EF.SitesDim, SiteLocation>();
            CreateMap<EF.SitesDim, SiteDetails>()
                .ForMember(a => a.SiteType, b => b.MapFrom(c => c.SiteTypeCv))
                .ForMember(a => a.PodOrPou, b => b.MapFrom(c => c.PODorPOUSite));
            CreateMap<EF.OrganizationsDim, Organization>();
            CreateMap<EF.WaterSourcesDim, WaterSourceInfoListItem>()
                .ForMember(dest => dest.WaterSourceType, opt => opt.MapFrom(source => source.WaterSourceTypeCv))
                .ForMember(dest => dest.GnisfeatureName, opt => opt.MapFrom(source => source.GnisfeatureNameCv));
            CreateMap<EF.AllocationAmountsFact, WaterRightsDigest>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.AllocationAmountId))
                .ForMember(dest => dest.NativeId, opt => opt.MapFrom(source => source.AllocationNativeId))
                .ForMember(dest => dest.PriorityDate, opt => opt.MapFrom(source => source.AllocationPriorityDateNavigation.Date))
                .ForMember(dest => dest.BeneficialUses, opt => opt.MapFrom(source => source.AllocationBridgeBeneficialUsesFact.Select(a=>a.BeneficialUseCV)));
            CreateMap<EF.BeneficialUsesCV, BeneficialUseItem>()
                .ForMember(dest => dest.BeneficialUseName, opt => opt.MapFrom(source => source.WaDEName.Length > 0 ? source.WaDEName : source.Name))
                .ForMember(dest => dest.ConsumptionCategory, opt => opt.MapFrom(source => source.ConsumptionCategoryType == null ? Common.ConsumptionCategory.Unspecified : source.ConsumptionCategoryType));
        }
    }
}
