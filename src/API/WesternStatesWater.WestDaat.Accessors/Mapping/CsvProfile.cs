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
            CreateMap<EF.MethodsDim, Methods>()
                .ForMember(dest => dest.MethodNemiLink, opt => opt.MapFrom(source => source.MethodNemilink));

            CreateMap<EF.OrganizationsDim, Organizations>();

            CreateMap<EF.VariablesDim, Variables>();

            CreateMap<EF.AllocationAmountsFact, WaterAllocationAccessor.WaterAllocationsHelper>();

            CreateMap<EF.AllocationAmountsFact, WaterAllocations>()
                .Include<EF.AllocationAmountsFact, WaterAllocationAccessor.WaterAllocationsHelper>()
                .ForMember(dest => dest.MethodUuid, opt => opt.MapFrom(source => source.Method.MethodUuid))
                .ForMember(dest => dest.OrganizationUuid, opt => opt.MapFrom(source => source.Organization.OrganizationUuid))
                .ForMember(dest => dest.SiteUuid, opt => opt.Ignore())
                .ForMember(dest => dest.VariableSpecificUuid, opt => opt.MapFrom(source => source.VariableSpecific.VariableSpecificUuid))
                .ForMember(dest => dest.AllocationUuid, opt => opt.MapFrom(source => source.AllocationUuid))
                .ForMember(dest => dest.AllocationApplicationDate, opt => opt.MapFrom(source => source.AllocationApplicationDateNavigation.Date))
                .ForMember(dest => dest.AllocationAssociatedConsumptiveUseSiteIds, opt => opt.MapFrom(source => source.AllocationAssociatedConsumptiveUseSiteIds))
                .ForMember(dest => dest.AllocationAssociatedWithdrawalSiteIds, opt => opt.MapFrom(source => source.AllocationAssociatedWithdrawalSiteIds))
                .ForMember(dest => dest.AllocationBasisCv, opt => opt.MapFrom(source => source.AllocationBasisCv))
                .ForMember(dest => dest.AllocationChangeApplicationIndicator, opt => opt.MapFrom(source => source.AllocationChangeApplicationIndicator))
                .ForMember(dest => dest.AllocationCommunityWaterSupplySystem, opt => opt.MapFrom(source => source.AllocationCommunityWaterSupplySystem))
                .ForMember(dest => dest.AllocationCropDutyAmount, opt => opt.MapFrom(source => source.AllocationCropDutyAmount))
                .ForMember(dest => dest.AllocationExpirationDate, opt => opt.MapFrom(source => source.AllocationExpirationDateNavigation.Date))
                .ForMember(dest => dest.AllocationFlow_CFS, opt => opt.MapFrom(source => source.AllocationFlow_CFS))
                .ForMember(dest => dest.AllocationLegalStatusCV, opt => opt.MapFrom(source => source.AllocationLegalStatusCv))
                .ForMember(dest => dest.AllocationNativeID, opt => opt.MapFrom(source => source.AllocationNativeId))
                .ForMember(dest => dest.AllocationOwner, opt => opt.MapFrom(source => source.AllocationOwner))
                .ForMember(dest => dest.AllocationPriorityDate, opt => opt.MapFrom(source => source.AllocationPriorityDateNavigation.Date))
                .ForMember(dest => dest.AllocationSDWISIdentifierCV, opt => opt.MapFrom(source => source.SdwisidentifierCV))
                .ForMember(dest => dest.AllocationTimeframeEnd, opt => opt.MapFrom(source => source.AllocationTimeframeEnd))
                .ForMember(dest => dest.AllocationTimeframeStart, opt => opt.MapFrom(source => source.AllocationTimeframeStart))
                .ForMember(dest => dest.AllocationTypeCv, opt => opt.MapFrom(source => source.AllocationTypeCv))
                .ForMember(dest => dest.AllocationVolume_AF, opt => opt.MapFrom(source => source.AllocationVolume_AF))
                .ForMember(dest => dest.BeneficialUseCategory, opt => opt.Ignore())
                .ForMember(dest => dest.CommunityWaterSupplySystem, opt => opt.MapFrom(source => source.CommunityWaterSupplySystem))
                .ForMember(dest => dest.CropTypeCv, opt => opt.MapFrom(source => source.CropTypeCV))
                .ForMember(dest => dest.CustomerTypeCv, opt => opt.MapFrom(source => source.CustomerTypeCV))
                .ForMember(dest => dest.DataPublicationDate, opt => opt.MapFrom(source => source.DataPublicationDate.Date))
                .ForMember(dest => dest.DataPublicationDoi, opt => opt.MapFrom(source => source.DataPublicationDoi))
                .ForMember(dest => dest.ExemptOfVolumeFlowPriority, opt => opt.MapFrom(source => source.ExemptOfVolumeFlowPriority))
                .ForMember(dest => dest.GeneratedPowerCapacityMW, opt => opt.MapFrom(source => source.GeneratedPowerCapacityMW))
                .ForMember(dest => dest.IrrigatedAcreage, opt => opt.MapFrom(source => source.IrrigatedAcreage))
                .ForMember(dest => dest.IrrigationMethodCv, opt => opt.MapFrom(source => source.IrrigationMethodCV))
                .ForMember(dest => dest.LegacyAllocationIds, opt => opt.MapFrom(source => source.LegacyAllocationIds))
                .ForMember(dest => dest.OwnerClassificationCv, opt => opt.MapFrom(source => source.OwnerClassificationCV))
                .ForMember(dest => dest.PopulationServed, opt => opt.MapFrom(source => source.PopulationServed))
                .ForMember(dest => dest.PowerType, opt => opt.MapFrom(source => source.PowerType))
                .ForMember(dest => dest.PrimaryUseCategory, opt => opt.MapFrom(source => source.PrimaryBeneficialUseCategory))
                .ForMember(dest => dest.WaterAllocationNativeUrl, opt => opt.MapFrom(source => source.WaterAllocationNativeUrl));

            CreateMap<EF.PODSiteToPOUSiteFact, PodSiteToPouSiteRelationships>()
                .ForMember(dest => dest.PODSiteUuid, opt => opt.MapFrom(source => source.PODSiteId.ToString()))
                .ForMember(dest => dest.POUSiteUuid, opt => opt.MapFrom(source => source.POUSiteId.ToString()))
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(source => source.StartDate))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(source => source.EndDate));

            CreateMap<EF.WaterSourcesDim, WaterSources>()
                .ForMember(dest => dest.WaterSourceUuid, opt => opt.MapFrom(source => source.WaterSourceUuid))
                .ForMember(dest => dest.Geometry, opt => opt.MapFrom(source => source.Geometry.IsValid ? source.Geometry.ToString() : string.Empty))
                .ForMember(dest => dest.GnisFeatureNameCv, opt => opt.MapFrom(source => source.GnisfeatureNameCv))
                .ForMember(dest => dest.WaterQualityIndicatorCv, opt => opt.MapFrom(source => source.WaterQualityIndicatorCv))
                .ForMember(dest => dest.WaterSourceName, opt => opt.MapFrom(source => source.WaterSourceName))
                .ForMember(dest => dest.WaterSourceNativeId, opt => opt.MapFrom(source => source.WaterSourceNativeId))
                .ForMember(dest => dest.WaterSourceTypeCv, opt => opt.MapFrom(source => source.WaterSourceTypeCv));

            CreateMap<EF.SitesDim, WaterAllocationAccessor.SitesHelper>();

            CreateMap<EF.SitesDim, Sites>()
                .Include<EF.SitesDim, WaterAllocationAccessor.SitesHelper>()
                .ForMember(dest => dest.SiteUuid, opt => opt.MapFrom(source => source.SiteUuid))
                .ForMember(dest => dest.WaterSourceUuids, opt => opt.Ignore())
                .ForMember(dest => dest.RegulatoryOverlayUuids, opt => opt.Ignore())
                .ForMember(dest => dest.EpsgCodeCv, opt => opt.MapFrom(source => source.EpsgcodeCv))
                .ForMember(dest => dest.Geometry, opt => opt.MapFrom(source => source.Geometry.IsValid ? source.Geometry.ToString() : string.Empty))
                .ForMember(dest => dest.NhdNetworkStatusCv, opt => opt.MapFrom(source => source.NhdnetworkStatusCv))
                .ForMember(dest => dest.HUC12, opt => opt.MapFrom(source => source.HUC12))
                .ForMember(dest => dest.HUC8, opt => opt.MapFrom(source => source.HUC8))
                .ForMember(dest => dest.ID, opt => opt.MapFrom(source => source.SiteId))
                .ForMember(dest => dest.SitePoint, opt => opt.MapFrom(source => source.SitePoint.IsValid ? source.SitePoint.ToString() : string.Empty))
                .ForMember(dest => dest.UsgsSiteId, opt => opt.MapFrom(source => source.UsgssiteId));
        }
    }
}
