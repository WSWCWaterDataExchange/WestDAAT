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

            CreateMap<EF.AllocationBridgeSitesFact, WaterAllocations>()
                .ForMember(dest => dest.MethodUuid, opt => opt.MapFrom(source => source.AllocationAmount.Method.MethodUuid))
                .ForMember(dest => dest.OrganizationUuid, opt => opt.MapFrom(source => source.AllocationAmount.Organization.OrganizationUuid))
                .ForMember(dest => dest.SiteUuid, opt => opt.MapFrom(source => source.Site.SiteUuid))
                .ForMember(dest => dest.VariableSpecificUuid, opt => opt.MapFrom(source => source.AllocationAmount.VariableSpecific.VariableSpecificUuid))
                .ForMember(dest => dest.AllocationApplicationDate, opt => opt.MapFrom(source => source.AllocationAmount.AllocationApplicationDateNavigation.Date))
                .ForMember(dest => dest.AllocationAssociatedConsumptiveUseSiteIds, opt => opt.MapFrom(source => source.AllocationAmount.AllocationAssociatedConsumptiveUseSiteIds))
                .ForMember(dest => dest.AllocationAssociatedWithdrawalSiteIds, opt => opt.MapFrom(source => source.AllocationAmount.AllocationAssociatedWithdrawalSiteIds))
                .ForMember(dest => dest.AllocationBasisCv, opt => opt.MapFrom(source => source.AllocationAmount.AllocationBasisCv))
                .ForMember(dest => dest.AllocationBasisCv, opt => opt.MapFrom(source => source.AllocationAmount.AllocationBasisCv))
                .ForMember(dest => dest.AllocationChangeApplicationIndicator, opt => opt.MapFrom(source => source.AllocationAmount.AllocationChangeApplicationIndicator))
                .ForMember(dest => dest.AllocationCommunityWaterSupplySystem, opt => opt.MapFrom(source => source.AllocationAmount.AllocationCommunityWaterSupplySystem))
                .ForMember(dest => dest.AllocationCropDutyAmount, opt => opt.MapFrom(source => source.AllocationAmount.AllocationCropDutyAmount))
                .ForMember(dest => dest.AllocationExpirationDate, opt => opt.MapFrom(source => source.AllocationAmount.AllocationExpirationDateNavigation.Date))
                .ForMember(dest => dest.AllocationFlow_CFS, opt => opt.MapFrom(source => source.AllocationAmount.AllocationFlow_CFS))
                .ForMember(dest => dest.AllocationLegalStatusCV, opt => opt.MapFrom(source => source.AllocationAmount.AllocationLegalStatusCv))
                .ForMember(dest => dest.AllocationNativeID, opt => opt.MapFrom(source => source.AllocationAmount.AllocationNativeId))
                .ForMember(dest => dest.AllocationOwner, opt => opt.MapFrom(source => source.AllocationAmount.AllocationOwner))
                .ForMember(dest => dest.AllocationPriorityDate, opt => opt.MapFrom(source => source.AllocationAmount.AllocationPriorityDateNavigation.Date))
                .ForMember(dest => dest.AllocationSDWISIdentifierCV, opt => opt.MapFrom(source => source.AllocationAmount.SdwisidentifierCV))
                .ForMember(dest => dest.AllocationTimeframeEnd, opt => opt.MapFrom(source => source.AllocationAmount.AllocationTimeframeEnd))
                .ForMember(dest => dest.AllocationTimeframeStart, opt => opt.MapFrom(source => source.AllocationAmount.AllocationTimeframeStart))
                .ForMember(dest => dest.AllocationTypeCv, opt => opt.MapFrom(source => source.AllocationAmount.AllocationTypeCv))
                .ForMember(dest => dest.AllocationVolume_AF, opt => opt.MapFrom(source => source.AllocationAmount.AllocationVolume_AF))
                .ForMember(dest => dest.BeneficialUseCategory, opt => opt.MapFrom(source => source.AllocationAmount.AllocationBridgeBeneficialUsesFact.Select(x => x.BeneficialUse.Name ?? x.BeneficialUseCV)))
                .ForMember(dest => dest.CommunityWaterSupplySystem, opt => opt.MapFrom(source => source.AllocationAmount.CommunityWaterSupplySystem))
                .ForMember(dest => dest.CropTypeCv, opt => opt.MapFrom(source => source.AllocationAmount.CropTypeCV))
                .ForMember(dest => dest.CustomerTypeCv, opt => opt.MapFrom(source => source.AllocationAmount.CustomerTypeCV))
                .ForMember(dest => dest.DataPublicationDate, opt => opt.MapFrom(source => source.AllocationAmount.DataPublicationDate.Date))
                .ForMember(dest => dest.DataPublicationDoi, opt => opt.MapFrom(source => source.AllocationAmount.DataPublicationDoi))
                .ForMember(dest => dest.ExemptOfVolumeFlowPriority, opt => opt.MapFrom(source => source.AllocationAmount.ExemptOfVolumeFlowPriority))
                .ForMember(dest => dest.GeneratedPowerCapacityMW, opt => opt.MapFrom(source => source.AllocationAmount.GeneratedPowerCapacityMW))
                .ForMember(dest => dest.IrrigatedAcreage, opt => opt.MapFrom(source => source.AllocationAmount.IrrigatedAcreage))
                .ForMember(dest => dest.IrrigationMethodCv, opt => opt.MapFrom(source => source.AllocationAmount.IrrigationMethodCV))
                .ForMember(dest => dest.LegacyAllocationIds, opt => opt.MapFrom(source => source.AllocationAmount.LegacyAllocationIds))
                .ForMember(dest => dest.OwnerClassificationCv, opt => opt.MapFrom(source => source.AllocationAmount.OwnerClassificationCV))
                .ForMember(dest => dest.PopulationServed, opt => opt.MapFrom(source => source.AllocationAmount.PopulationServed))
                .ForMember(dest => dest.PowerType, opt => opt.MapFrom(source => source.AllocationAmount.PowerType))
                .ForMember(dest => dest.PrimaryUseCategory, opt => opt.MapFrom(source => source.AllocationAmount.PrimaryBeneficialUseCategory))
                .ForMember(dest => dest.WaterAllocationNativeUrl, opt => opt.MapFrom(source => source.AllocationAmount.WaterAllocationNativeUrl));

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

            CreateMap<EF.SitesDim, Sites>()
                .ForMember(dest => dest.SiteUuid, opt => opt.MapFrom(source => source.SiteUuid))
                .ForMember(dest => dest.WaterSourceUuids, opt => opt.MapFrom(source => source.WaterSourceBridgeSitesFact.Select(a => a.WaterSource.WaterSourceUuid)))
                .ForMember(dest => dest.RegulatoryOverlayUuids, opt => opt.MapFrom(source => source.RegulatoryOverlayBridgeSitesFact.Select(x=>x.RegulatoryOverlay.RegulatoryOverlayUuid)))
                .ForMember(dest => dest.EpsgCodeCv, opt => opt.MapFrom(source => source.EpsgcodeCv))
                .ForMember(dest => dest.Geometry, opt => opt.MapFrom(source => source.Geometry.IsValid ? source.Geometry.ToString() : string.Empty))
                .ForMember(dest => dest.NhdNetworkStatusCv, opt => opt.MapFrom(source => source.NhdnetworkStatusCv))
                .ForMember(dest => dest.HUC12, opt => opt.MapFrom(source => $"\t{source.HUC12}")) //https://github.com/JoshClose/CsvHelper/issues/409 seems to be an accepted solution.
                .ForMember(dest => dest.HUC8, opt => opt.MapFrom(source => $"\t{source.HUC8}"))
                .ForMember(dest => dest.ID, opt => opt.MapFrom(source => source.SiteId))
                .ForMember(dest => dest.SitePoint, opt => opt.MapFrom(source => source.SitePoint.IsValid ? source.SitePoint.ToString() : string.Empty))
                .ForMember(dest => dest.UsgsSiteId, opt => opt.MapFrom(source => source.UsgssiteId));
        }
    }
}
