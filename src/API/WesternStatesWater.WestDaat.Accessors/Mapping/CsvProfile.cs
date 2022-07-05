using AutoMapper;
using System.Runtime.CompilerServices;
using WesternStatesWater.WestDaat.Accessors.CsvModels;
using CommonDto = WesternStatesWater.WestDaat.Common.DataContracts;
using EF = WesternStatesWater.WestDaat.Accessors.EntityFramework;

[assembly: InternalsVisibleTo("WesternStatesWater.WestDaat.Tests.AccessorTests")]

namespace WesternStatesWater.WestDaat.Accessors.Mapping
{
    internal class CsvProfile : Profile
    {
        public CsvProfile()
        {
            CreateMap<EF.AllocationAmountsFact, Methods>()
                .ForMember(dest => dest.MethodUuid, opt => opt.MapFrom(source => source.Method.MethodUuid))
                .ForMember(dest => dest.ApplicableResourceTypeCv, opt => opt.MapFrom(source => source.Method.ApplicableResourceTypeCv))
                .ForMember(dest => dest.DataConfidenceValue, opt => opt.MapFrom(source => source.Method.DataConfidenceValue))
                .ForMember(dest => dest.DataCoverageValue, opt => opt.MapFrom(source => source.Method.DataCoverageValue))
                .ForMember(dest => dest.DataQualityValueCv, opt => opt.MapFrom(source => source.Method.DataQualityValueCv))
                .ForMember(dest => dest.MethodDescription, opt => opt.MapFrom(source => source.Method.MethodDescription))
                .ForMember(dest => dest.MethodName, opt => opt.MapFrom(source => source.Method.MethodName))
                .ForMember(dest => dest.MethodNemiLink, opt => opt.MapFrom(source => source.Method.MethodNemilink))
                .ForMember(dest => dest.MethodTypeCv, opt => opt.MapFrom(source => source.Method.MethodTypeCv));

            CreateMap<EF.AllocationAmountsFact, Organizations>()
                .ForMember(dest => dest.OrganizationUuid, opt => opt.MapFrom(source => source.Organization.OrganizationUuid))
                .ForMember(dest => dest.OrganizationContactEmail, opt => opt.MapFrom(source => source.Organization.OrganizationContactEmail))
                .ForMember(dest => dest.OrganizationContactName, opt => opt.MapFrom(source => source.Organization.OrganizationContactName))
                .ForMember(dest => dest.OrganizationDataMappingUrl, opt => opt.MapFrom(source => source.Organization.OrganizationDataMappingUrl))
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(source => source.Organization.OrganizationName))
                .ForMember(dest => dest.OrganizationPhoneNumber, opt => opt.MapFrom(source => source.Organization.OrganizationPhoneNumber))
                .ForMember(dest => dest.OrganizationPurview, opt => opt.MapFrom(source => source.Organization.OrganizationPurview))
                .ForMember(dest => dest.OrganizationWebsite, opt => opt.MapFrom(source => source.Organization.OrganizationWebsite))
                .ForMember(dest => dest.State, opt => opt.MapFrom(source => source.Organization.State));

            CreateMap<EF.AllocationAmountsFact, PodSiteToPouSiteRelationships>() // these are failing, not sure why
                .ForMember(dest => dest.PODSiteUuid, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.PODSiteToPOUSitePOUFact.Select(y => y.PODSiteId))))
                .ForMember(dest => dest.POUSiteUuid, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.PODSiteToPOUSitePOUFact.Select(y => y.POUSiteId))))
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.PODSiteToPOUSitePODFact.Select(y => y.StartDate.Date))))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.PODSiteToPOUSitePOUFact.Select(y => y.EndDate))));

            // it's null
            CreateMap<EF.AllocationAmountsFact, Sites>()
                .ForMember(dest => dest.SiteUuid, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.SiteUuid)))
                .ForMember(dest => dest.Regulatory, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.RegulatoryOverlayBridgeSitesFact.Select(y => y.RegulatoryOverlay.RegulatoryName)))) // confirm with WaDE
                .ForMember(dest => dest.WaterSourceUuids, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.WaterSourceBridgeSitesFact.Select(y => y.WaterSource.WaterSourceUuid))))
                .ForMember(dest => dest.CoordinateAccuracy, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.CoordinateAccuracy)))
                .ForMember(dest => dest.CoordinateMethodCv, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.CoordinateMethodCv)))
                .ForMember(dest => dest.County, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.County)))
                .ForMember(dest => dest.EpsgCodeCv, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.EpsgcodeCv)))
                .ForMember(dest => dest.GnisCodeCv, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.GniscodeCv)))
                .ForMember(dest => dest.HUC12, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.HUC12)))
                .ForMember(dest => dest.HUC8, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.HUC8)))
                .ForMember(dest => dest.NhdNetworkStatusCv, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.NhdnetworkStatusCv)))
                .ForMember(dest => dest.NhdProductCv, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.NhdproductCv)))
                .ForMember(dest => dest.PODorPOUSite, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.PODorPOUSite)))
                .ForMember(dest => dest.SiteName, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.SiteName)))
                .ForMember(dest => dest.SiteNativeId, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.SiteNativeId)))
                .ForMember(dest => dest.ID, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.SiteId)))
                .ForMember(dest => dest.SiteTypeCv, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.SiteTypeCv)))
                .ForMember(dest => dest.StateCv, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.StateCv)))
                .ForMember(dest => dest.UsgsSiteId, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.UsgssiteId)))
                .ForMember(dest => dest.Geometry, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.Geometry.ToString())))
                .ForMember(dest => dest.SitePoint, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.SitePoint.ToString())))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.Latitude)))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(x => x.Site.Longitude)));

            // Works Fine
            CreateMap<EF.AllocationAmountsFact, Variables>()
                .ForMember(dest => dest.VariableSpecificUuid, opt => opt.MapFrom(source => source.VariableSpecific.VariableSpecificUuid))
                .ForMember(dest => dest.AggregationInterval, opt => opt.MapFrom(source => source.VariableSpecific.AggregationInterval))
                .ForMember(dest => dest.AggregationIntervalUnitCv, opt => opt.MapFrom(source => source.VariableSpecific.AggregationIntervalUnitCv))
                .ForMember(dest => dest.AggregationStatisticCv, opt => opt.MapFrom(source => source.VariableSpecific.AggregationStatisticCv))
                .ForMember(dest => dest.AmountUnitCv, opt => opt.MapFrom(source => source.VariableSpecific.AmountUnitCv))
                .ForMember(dest => dest.MaximumAmountUnitCv, opt => opt.MapFrom(source => source.VariableSpecific.MaximumAmountUnitCv))
                .ForMember(dest => dest.ReportYearStartMonth, opt => opt.MapFrom(source => source.VariableSpecific.ReportYearStartMonth))
                .ForMember(dest => dest.ReportYearTypeCv, opt => opt.MapFrom(source => source.VariableSpecific.ReportYearTypeCv))
                .ForMember(dest => dest.VariableCv, opt => opt.MapFrom(source => source.VariableSpecific.VariableCv))
                .ForMember(dest => dest.VariableSpecificCv, opt => opt.MapFrom(source => source.VariableSpecific.VariableCv));

            // it's null
            CreateMap<EF.AllocationAmountsFact, WaterAllocations>()
                .ForMember(dest => dest.DataPublicationDate, opt => opt.MapFrom(source => source.DataPublicationDate.Date))
                .ForMember(dest => dest.DataPublicationDoi, opt => opt.MapFrom(source => source.DataPublicationDoi))
                .ForMember(dest => dest.MethodUuid, opt => opt.MapFrom(source => source.Method.MethodUuid))
                .ForMember(dest => dest.OrganizationUuid, opt => opt.MapFrom(source => source.Organization.OrganizationUuid))
                .ForMember(dest => dest.SiteUuid, opt => opt.MapFrom(source => source.AllocationBridgeSitesFact.Select(site => site.Site.SiteUuid)))
                .ForMember(dest => dest.VariableSpecificUuid, opt => opt.MapFrom(source => source.VariableSpecific.VariableSpecificUuid))
                .ForMember(dest => dest.CropTypeCv, opt => opt.MapFrom(source => source.CropTypeCV))
                .ForMember(dest => dest.CustomerTypeCv, opt => opt.MapFrom(source => source.CustomerTypeCV))
                .ForMember(dest => dest.CropTypeCv, opt => opt.MapFrom(source => source.CropTypeCV))
                .ForMember(dest => dest.IrrigationMethodCv, opt => opt.MapFrom(source => source.IrrigationMethodCV))
                .ForMember(dest => dest.AllocationSDWISIdentifierCV, opt => opt.MapFrom(source => source.SDWISIdentifier.Definition)) // Confirm with Wad
                .ForMember(dest => dest.PrimaryUseCategory, opt => opt.MapFrom(source => source.PrimaryBeneficialUseCategory))
                .ForMember(dest => dest.AllocationApplicationDate, opt => opt.MapFrom(source => source.AllocationApplicationDateNavigation.Date))
                .ForMember(dest => dest.AllocationExpirationDate, opt => opt.MapFrom(source => source.AllocationExpirationDateNavigation.Date))
                .ForMember(dest => dest.AllocationPriorityDate, opt => opt.MapFrom(source => source.AllocationPriorityDateNavigation.Date))
                .ForMember(dest => dest.BeneficialUseCategory, opt => opt.MapFrom(source => source.AllocationBridgeBeneficialUsesFact.Select(x => x.BeneficialUse)));


            // where this properties come from ? -- Water sources
            CreateMap<EF.AllocationAmountsFact, WaterSources>()
                .ForMember(dest => dest.WaterSourceUuid, opt => opt.MapFrom(source => source.AggregatedAmountsFact.Select(x => x.WaterSource.WaterSourceUuid)))
                .ForMember(dest => dest.Geometry, opt => opt.MapFrom(source => source.AggregatedAmountsFact.Select(x => x.WaterSource.Geometry.ToString())))
                .ForMember(dest => dest.GnisFeatureNameCv, opt => opt.MapFrom(source => source.AggregatedAmountsFact.Select(x => x.WaterSource.GnisfeatureNameCv)))
                .ForMember(dest => dest.WaterQualityIndicatorCv, opt => opt.MapFrom(source => source.AggregatedAmountsFact.Select(x => x.WaterSource.WaterQualityIndicatorCv)))
                .ForMember(dest => dest.WaterSourceName, opt => opt.MapFrom(source => source.AggregatedAmountsFact.Select(x => x.WaterSource.WaterSourceName)))
                .ForMember(dest => dest.WaterSourceNativeId, opt => opt.MapFrom(source => source.AggregatedAmountsFact.Select(x => x.WaterSource.WaterSourceNativeId)))
                .ForMember(dest => dest.WaterSourceTypeCv, opt => opt.MapFrom(source => source.AggregatedAmountsFact.Select(x => x.WaterSource.WaterSourceTypeCv)));
        }
    }
}
