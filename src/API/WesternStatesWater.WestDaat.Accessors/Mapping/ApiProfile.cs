﻿using AutoMapper;
using System.Runtime.CompilerServices;
using WesternStatesWater.WestDaat.Common.DataContracts;

[assembly: InternalsVisibleTo("WesternStatesWater.WestDaat.Tests.AccessorTests")]

namespace WesternStatesWater.WestDaat.Accessors.Mapping
{
    internal class ApiProfile : Profile
    {
#pragma warning disable CA1502
        public ApiProfile()
        {
            CreateMap<EF.AllocationAmountsFact, AllocationAmount>()
                .ForMember(a => a.BeneficialUses,
                    b => b.MapFrom(c => c.AllocationBridgeBeneficialUsesFact.Select(d => d.BeneficialUse.WaDEName.Length > 0 ? d.BeneficialUse.WaDEName : d.BeneficialUseCV)))
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
                .ForMember(dest => dest.ApplicableResourceType, opt => opt.MapFrom(source => source.Method.ApplicableResourceTypeCv))
                .ForMember(dest => dest.DatePublished, opt => opt.MapFrom(source => source.DataPublicationDate.Date))
                .ForMember(dest => dest.WaDEIrrigationMethod, opt => opt.MapFrom(source => source.IrrigationMethod.WaDEName))
                .ForMember(dest => dest.WaDEDataMappingUrl, opt => opt.MapFrom(source => source.Method.WaDEDataMappingUrl))
                .ForMember(dest => dest.IsConservationApplicationEligible, opt => opt.MapFrom(source => source.ConservationApplicationFundingOrganizationId != null));
            CreateMap<EF.AllocationAmountsFact, WaterRightInfoListItem>()
                .ForMember(dest => dest.Volume, opt => opt.MapFrom(source => source.AllocationVolume_AF))
                .ForMember(dest => dest.Flow, opt => opt.MapFrom(source => source.AllocationFlow_CFS))
                .ForMember(dest => dest.WaterRightNativeId, opt => opt.MapFrom(source => source.AllocationNativeId))
                .ForMember(dest => dest.Owner, opt => opt.MapFrom(source => source.AllocationOwner))
                .ForMember(dest => dest.LegalStatus, opt => opt.MapFrom(source => source.AllocationLegalStatusCv))
                .ForMember(dest => dest.BeneficialUses, opt => opt.MapFrom(source => source.AllocationBridgeBeneficialUsesFact.Select(a => a.BeneficialUseCV)))
                .ForMember(dest => dest.PriorityDate, opt => opt.MapFrom(source => source.AllocationPriorityDateNavigation.Date))
                .ForMember(dest => dest.ExpirationDate, opt => opt.MapFrom(source => source.AllocationExpirationDateNavigation.Date));
            CreateMap<EF.AllocationAmountsFact, WaterRightsSearchDetail>()
                .ForMember(dest => dest.BeneficialUses,
                    opt => opt.MapFrom(source =>
                        source.AllocationBridgeBeneficialUsesFact.Select(b => b.BeneficialUse.WaDEName.Length > 0 ? b.BeneficialUse.WaDEName : b.BeneficialUse.Name).ToArray()))
                .ForMember(dest => dest.OwnerClassification,
                    opt => opt.MapFrom(source => source.OwnerClassification.WaDEName.Length > 0 ? source.OwnerClassification.WaDEName : source.OwnerClassification.Name))
                .ForMember(dest => dest.AllocationFlowCfs, opt => opt.MapFrom(source => source.AllocationFlow_CFS))
                .ForMember(dest => dest.AllocationVolumeAf, opt => opt.MapFrom(source => source.AllocationVolume_AF))
                .ForMember(dest => dest.AllocationPriorityDate,
                    opt => opt.MapFrom(source =>
                        (source.AllocationPriorityDateID != null && source.AllocationPriorityDateNavigation.Date != default)
                            ? source.AllocationPriorityDateNavigation.Date
                            : (DateTime?)null))
                .ForMember(dest => dest.AllocationLegalStatus,
                    opt => opt.MapFrom(source =>
                        source.AllocationLegalStatusCvNavigation.WaDEName.Length > 0
                            ? source.AllocationLegalStatusCvNavigation.WaDEName
                            : source.AllocationLegalStatusCvNavigation.Name));
            CreateMap<EF.SitesDim, Site>()
                .ForMember(a => a.AllocationIds, b => b.MapFrom(c => c.AllocationBridgeSitesFact.Select(allocation => allocation.AllocationBridgeId)))
                .ForMember(a => a.SiteType, b => b.MapFrom(c => c.SiteTypeCvNavigation.WaDEName.Length > 0 ? c.SiteTypeCvNavigation.WaDEName : c.SiteTypeCv))
                .ForMember(a => a.Geometry, b => b.MapFrom(c => c.Geometry ?? c.SitePoint))
                .ForMember(a => a.PodPou, b => b.MapFrom(c => c.PODorPOUSite))
                .ForMember(a => a.WaterSourceTypes,
                    b => b.MapFrom(c => c.WaterSourceBridgeSitesFact.Select(d =>
                        d.WaterSource.WaterSourceTypeCvNavigation.WaDEName.Length > 0 ? d.WaterSource.WaterSourceTypeCvNavigation.WaDEName : d.WaterSource.WaterSourceTypeCv)));
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
            CreateMap<EF.BeneficialUsesCV, BeneficialUseItem>()
                .ForMember(dest => dest.BeneficialUseName, opt => opt.MapFrom(source => source.WaDEName.Length > 0 ? source.WaDEName : source.Name))
                .ForMember(dest => dest.ConsumptionCategory,
                    opt => opt.MapFrom(source => source.ConsumptionCategoryType == null ? Common.ConsumptionCategory.Unspecified : source.ConsumptionCategoryType));

            CreateMap<EF.SiteVariableAmountsFact, SiteUsagePoint>()
                .ForMember(dest => dest.Amount, opt => opt.MapFrom(source => source.Amount))
                .ForMember(dest => dest.TimeFrameStartDate, opt => opt.MapFrom(source => source.TimeframeStartNavigation.Date))
                .ForMember(dest => dest.VariableUuid, opt => opt.MapFrom(source => source.VariableSpecific.VariableSpecificUuid))
                .ForMember(dest => dest.AmountUnit, opt => opt.MapFrom(source => source.VariableSpecific.AmountUnitCv))
                ;

            CreateMap<EF.VariablesDim, VariableInfoListItem>()
                .ForMember(dest => dest.WaDEVariableUuid, opt => opt.MapFrom(source => source.VariableSpecificUuid))
                .ForMember(dest => dest.Variable,
                    opt => opt.MapFrom(source => source.VariableCvNavigation.WaDEName.Length > 0 ? source.VariableCvNavigation.WaDEName : source.VariableCv))
                .ForMember(dest => dest.VariableSpecificType,
                    opt => opt.MapFrom(source => source.VariableSpecificCvNavigation.WaDEName.Length > 0 ? source.VariableSpecificCvNavigation.Term : source.VariableSpecificCv))
                .ForMember(dest => dest.AmountUnit,
                    opt => opt.MapFrom(source => source.AmountUnitCvNavigation.WaDEName.Length > 0 ? source.AmountUnitCvNavigation.WaDEName : source.AmountUnitCv))
                .ForMember(dest => dest.AggregationStatistic,
                    opt => opt.MapFrom(source =>
                        source.AggregationStatisticCvNavigation.WaDEName.Length > 0 ? source.AggregationStatisticCvNavigation.WaDEName : source.AggregationStatisticCv))
                .ForMember(dest => dest.AggregationInterval, opt => opt.MapFrom(source => source.AggregationInterval))
                .ForMember(dest => dest.AggregationIntervalUnit,
                    opt => opt.MapFrom(source =>
                        source.AggregationIntervalUnitCvNavigation.WaDEName.Length > 0 ? source.AggregationIntervalUnitCvNavigation.WaDEName : source.AggregationIntervalUnitCv))
                .ForMember(dest => dest.ReportYearStartMonth, opt => opt.MapFrom(source => source.ReportYearStartMonth))
                .ForMember(dest => dest.ReportYearType,
                    opt => opt.MapFrom(source => source.ReportYearTypeCvNavigation.WaDEName.Length > 0 ? source.ReportYearTypeCvNavigation.WaDEName : source.ReportYearTypeCv))
                ;

            CreateMap<EF.ReportingUnitsDim, OverlayDetails>()
                .ForMember(dest => dest.WaDEAreaReportingUuid, opt => opt.MapFrom(source => source.ReportingUnitUuid))
                .ForMember(dest => dest.ReportingAreaNativeID, opt => opt.MapFrom(source => source.ReportingUnitNativeId))
                .ForMember(dest => dest.WaDEOverlayAreaType, opt => opt.MapFrom(source =>
                    source.OverlayReportingUnitsFact
                        .Select(rr => rr.Overlay.OverlayTypeCV)
                        .Distinct().ToList()))
                .ForMember(dest => dest.NativeReportingAreaType, opt => opt.MapFrom(source => source.ReportingUnitTypeCv))
                .ForMember(dest => dest.State, opt => opt.MapFrom(source => source.StateCv))
                .ForMember(dest => dest.AreaLastUpdatedDate, opt => opt.MapFrom(source => source.ReportingUnitUpdateDate))
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(source => source.OverlayReportingUnitsFact
                    .Select(rr => rr.Organization.OrganizationName).FirstOrDefault()))
                .ForMember(dest => dest.OrganizationState, opt => opt.MapFrom(source => source.OverlayReportingUnitsFact
                    .Select(rr => rr.Organization.State).FirstOrDefault()))
                .ForMember(dest => dest.OrganizationWebsite, opt => opt.MapFrom(source => source.OverlayReportingUnitsFact
                    .Select(rr => rr.Organization.OrganizationWebsite).FirstOrDefault()))
                .ForMember(dest => dest.Geometry, opt => opt.MapFrom(source => source.Geometry));

            CreateMap<EF.MethodsDim, MethodInfoListItem>()
                .ForMember(dest => dest.WaDEMethodUuid, opt => opt.MapFrom(source => source.MethodUuid))
                .ForMember(dest => dest.ApplicationResourceType,
                    opt => opt.MapFrom(source =>
                        source.ApplicableResourceTypeCvNavigation.WaDEName.Length > 0 ? source.ApplicableResourceTypeCvNavigation.WaDEName : source.ApplicableResourceTypeCv))
                .ForMember(dest => dest.MethodType,
                    opt => opt.MapFrom(source => source.MethodTypeCvNavigation.WaDEName.Length > 0 ? source.MethodTypeCvNavigation.WaDEName : source.MethodTypeCv))
                .ForMember(dest => dest.MethodUrl, opt => opt.MapFrom(source => source.MethodNemilink))
                .ForMember(dest => dest.WaDEDataMappingProcessUrl, opt => opt.MapFrom(source => source.WaDEDataMappingUrl))
                .ForMember(dest => dest.MethodDescription, opt => opt.MapFrom(source => source.MethodDescription));

            CreateMap<EF.OverlayDim, OverlayTableEntry>()
                .ForMember(dest => dest.WaDEOverlayUuid, opt => opt.MapFrom(source => source.OverlayUuid))
                .ForMember(dest => dest.OverlayNativeID, opt => opt.MapFrom(source => source.OverlayNativeId))
                .ForMember(dest => dest.OverlayName, opt => opt.MapFrom(source => source.OverlayName))
                .ForMember(dest => dest.OverlayType,
                    opt => opt.MapFrom(source => source.OverlayType.WaDEName.Length > 0 ? source.OverlayType.WaDEName : source.OverlayTypeCV))
                .ForMember(dest => dest.WaterSourceType,
                    opt => opt.MapFrom(source => source.WaterSourceType.WaDEName.Length > 0 ? source.WaterSourceType.WaDEName : source.WaterSourceTypeCV))
                .ForMember(dest => dest.OverlayStatus, opt => opt.MapFrom(source => source.OverlayStatusCv))
                .ForMember(dest => dest.OverlayStatute, opt => opt.MapFrom(source => source.Statute))
                .ForMember(dest => dest.StatuteLink, opt => opt.MapFrom(source => source.StatuteLink))
                .ForMember(dest => dest.StatutoryEffectiveDate, opt => opt.MapFrom(source => source.StatutoryEffectiveDate))
                .ForMember(dest => dest.StatutoryEndDate, opt => opt.MapFrom(source => source.StatutoryEndDate))
                .ForMember(dest => dest.OverlayStatusDesc, opt => opt.MapFrom(source => source.OverlayDescription));

            CreateMap<EF.ReportingUnitsDim, OverlayDigest>()
                .ForMember(dest => dest.WaDeAreaReportingUuid, opt => opt.MapFrom(source => source.ReportingUnitUuid))
                .ForMember(dest => dest.ReportingAreaNativeId, opt => opt.MapFrom(source => source.ReportingUnitNativeId))
                .ForMember(dest => dest.ReportingAreaName, opt => opt.MapFrom(source => source.ReportingUnitName))
                .ForMember(dest => dest.WaDeOverlayAreaType, opt => opt.MapFrom(source =>
                    source.OverlayReportingUnitsFact
                        .Select(rr => rr.Overlay.OverlayTypeCV)
                        .Distinct()
                        .ToList()))
                .ForMember(dest => dest.NativeOverlayAreaType, opt => opt.MapFrom(source => source.ReportingUnitTypeCv));

            CreateMap<EF.AllocationAmountsFact, WaterRightsDigest>()
                .ForMember(dest => dest.AllocationUuid, opt => opt.MapFrom(src => src.AllocationUuid))
                .ForMember(dest => dest.NativeId, opt => opt.MapFrom(src => src.AllocationNativeId))
                .ForMember(dest => dest.PriorityDate, opt => opt.MapFrom(src => src.AllocationPriorityDateNavigation.Date))
                .ForMember(dest => dest.BeneficialUses, opt => opt.MapFrom(src => src.AllocationBridgeBeneficialUsesFact.Select(a => a.BeneficialUseCV).ToList()))
                .ForMember(dest => dest.HasTimeSeriesData, opt => opt.MapFrom(src => src.AllocationBridgeSitesFact.Any(bs => bs.Site.SiteVariableAmountsFact.Any())));

            CreateMap<EF.SitesDim, SiteDigest>()
                .ForMember(dest => dest.SiteUuid, opt => opt.MapFrom(src => src.SiteUuid))
                .ForMember(dest => dest.SiteNativeId, opt => opt.MapFrom(src => src.SiteNativeId))
                .ForMember(dest => dest.SiteName, opt => opt.MapFrom(src => src.SiteName))
                .ForMember(dest => dest.SiteType, opt => opt.MapFrom(src => src.SiteTypeCv))
                .ForMember(dest => dest.HasTimeSeriesData, opt => opt.MapFrom(src => src.SiteVariableAmountsFact.Any()))
                .ForMember(dest => dest.TimeSeriesVariableTypes, opt => opt.MapFrom(src => src.SiteVariableAmountsFact.Select(ts => ts.VariableSpecific.VariableCv).Distinct()))
                .ForMember(dest => dest.WaterRightsDigests,
                    opt => opt.MapFrom(src => src.AllocationBridgeSitesFact.Select(ab => ab.AllocationAmount)));


            AddUserMappings();
            AddOrganizationMappings();
            AddApplicationMappings();
        }

        private void AddUserMappings()
        {
            CreateMap<UserStoreCreateRequest, EFWD.User>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTimeOffset.UtcNow))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.UserProfile, opt => opt.Ignore())
                .ForMember(dest => dest.UserRoles, opt => opt.Ignore())
                .ForMember(dest => dest.UserOrganizations, opt => opt.Ignore());

            CreateProjection<EFWD.User, UserSearchResult>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.UserProfile.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.UserProfile.LastName))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserProfile.UserName));

            CreateProjection<EFWD.User, UserListResult>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.UserProfile.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.UserProfile.LastName))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserProfile.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                // Intentionally only mapping the first org and first role. Multi-org / multi-role is not supported.
                // Do not FirstOrDefault. We don't want this to silently fail if multi is supported later
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.UserOrganizations.Single().UserOrganizationRoles.Single().Role));

            CreateMap<EFWD.User, UserProfile>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.OrganizationMemberships, opt => opt.MapFrom(src => src.UserOrganizations))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.UserProfile.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.UserProfile.LastName))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserProfile.UserName))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.UserProfile.State))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.UserProfile.Country))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.UserProfile.PhoneNumber))
                .ForMember(dest => dest.AffiliatedOrganization, opt => opt.MapFrom(src => src.UserProfile.AffiliatedOrganization))
                .ForMember(dest => dest.IsSignupComplete, opt => opt.MapFrom(src => src.UserProfile != null && src.UserProfile.IsSignupComplete));

            CreateMap<EFWD.UserOrganization, OrganizationMembership>()
                .ForMember(dest => dest.OrganizationId, opt => opt.MapFrom(src => src.OrganizationId))
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(src => src.Organization.Name))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.UserOrganizationRoles.Single().Role));

            CreateMap<UserProfileUpdateRequest, EFWD.User>()
                .ForMember(dest => dest.UserProfile, opt => opt.MapFrom(src => src))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Email, opt => opt.Ignore())
                .ForMember(dest => dest.ExternalAuthId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UserRoles, opt => opt.Ignore())
                .ForMember(dest => dest.UserOrganizations, opt => opt.Ignore());

            CreateMap<UserProfileCreateRequest, EFWD.UserProfile>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.IsSignupComplete, opt => opt.MapFrom(_ => true));

            CreateMap<UserProfileUpdateRequest, EFWD.UserProfile>(MemberList.Source);

            CreateMap<EFWD.User, NotificationUser>()
                .ForMember(dest => dest.EmailAddress, opt => opt.MapFrom(src => src.Email));
        }

        private void AddOrganizationMappings()
        {
            CreateMap<EFWD.Organization, OrganizationListItem>()
                .ForMember(dest => dest.OrganizationId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserCount, opt => opt.MapFrom(src => src.UserOrganizations.Count));

            CreateMap<EFWD.Organization, OrganizationSummaryItem>()
                .ForMember(dest => dest.OrganizationId, opt => opt.MapFrom(src => src.Id));

            CreateMap<EFWD.Organization, OrganizationFundingDetails>()
                .ForMember(dest => dest.OrganizationId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.CompensationRateModel, opt => opt.MapFrom(src => src.OpenEtCompensationRateModel))
                .ForMember(dest => dest.OpenEtModelDisplayName, opt => opt.MapFrom(src => Enum.GetName(src.OpenEtModel)))
                .ForMember(dest => dest.OpenEtDateRangeStart, opt => opt.MapFrom(src =>
                        // start of current year minus `dateRange` years
                        DateOnly.FromDateTime(
                            new DateTimeOffset(DateTimeOffset.UtcNow.Year - src.OpenEtDateRangeInYears, 1, 1, 0, 0, 0, TimeSpan.Zero)
                                .UtcDateTime
                        )
                    )
                )
                .ForMember(dest => dest.OpenEtDateRangeEnd, opt => opt.MapFrom(src =>
                        // start of current year minus one minute to get end of previous year
                        DateOnly.FromDateTime(
                            new DateTimeOffset(DateTimeOffset.UtcNow.Year, 1, 1, 0, 0, 0, TimeSpan.Zero).AddMinutes(-1)
                                .UtcDateTime
                        )
                    )
                );
        }

        private void AddApplicationMappings()
        {
            CreateMap<EFWD.WaterConservationApplication, ApplicationListItemDetails>()
                .ForMember(dest => dest.ApplicantFullName, opt =>
                {
                    opt.PreCondition(src => src.ApplicantUser.UserProfile != null);
                    opt.MapFrom(src => $"{src.ApplicantUser.UserProfile.FirstName} {src.ApplicantUser.UserProfile.LastName}");
                })
                .ForMember(dest => dest.ApplicationId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(src => src.FundingOrganization.Name))
                .ForMember(dest => dest.CompensationRateDollars, opt => opt.MapFrom(src => src.Estimate.CompensationRateDollars))
                .ForMember(dest => dest.CompensationRateUnits, opt => opt.MapFrom(src => src.Estimate.CompensationRateUnits))
                .ForMember(dest => dest.SubmittedDate, opt => opt.MapFrom(src => src.Submission.SubmittedDate))
                .ForMember(dest => dest.ApprovedDate, opt => opt.MapFrom(src => src.Submission.ApprovedDate))
                .ForMember(dest => dest.DeniedDate, opt => opt.MapFrom(src => src.Submission.DeniedDate))
                .ForMember(dest => dest.RecommendedForDate, opt => opt.MapFrom(src => src.Submission.RecommendedForDate))
                .ForMember(dest => dest.RecommendedAgainstDate, opt => opt.MapFrom(src => src.Submission.RecommendedAgainstDate))
                .ForMember(dest => dest.RecommendedByUserId, opt => opt.MapFrom(src => src.Submission.RecommendedByUserId))
                .ForMember(dest => dest.WaterRightState, opt => opt.MapFrom(src => src.Submission.WaterRightState))
                .ForMember(dest => dest.EstimatedCompensationDollars, opt => opt.MapFrom(src => src.Estimate.EstimatedCompensationDollars))
                .ForMember(dest => dest.CumulativeTotalEtInAcreFeet, opt => opt.MapFrom(src => src.Estimate.CumulativeTotalEtInAcreFeet));

            CreateMap<ApplicationEstimateStoreLocationConsumptiveUseDetails, EFWD.LocationWaterMeasurement>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationEstimateLocationId, opt => opt.Ignore())
                .ForMember(dest => dest.Location, opt => opt.Ignore());

            CreateMap<ApplicationEstimateStoreControlLocationWaterMeasurementsDetails, EFWD.ControlLocationWaterMeasurement>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationEstimateControlLocationId, opt => opt.Ignore())
                .ForMember(dest => dest.Location, opt => opt.Ignore());

            CreateMap<ApplicationEstimateStoreLocationDetails, EFWD.WaterConservationApplicationEstimateLocation>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationEstimateId, opt => opt.Ignore())
                .ForMember(dest => dest.Estimate, opt => opt.Ignore())
                .ForMember(dest => dest.AdditionalDetails, opt => opt.Ignore())
                .ForMember(dest => dest.WaterMeasurements, opt => opt.MapFrom(src => src.ConsumptiveUses));

            CreateMap<ApplicationEstimateStoreControlLocationDetails, EFWD.WaterConservationApplicationEstimateControlLocation>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationEstimateId, opt => opt.Ignore())
                .ForMember(dest => dest.Estimate, opt => opt.Ignore())
                .ForMember(dest => dest.WaterMeasurements, opt => opt.MapFrom(src => src.WaterMeasurements));

            CreateMap<ApplicationEstimateStoreRequest, EFWD.WaterConservationApplicationEstimate>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplication, opt => opt.Ignore())
                .ForMember(dest => dest.ControlLocations, opt => opt.Ignore())
                .ForMember(dest => dest.CumulativeNetEtInAcreFeet, opt => opt.Ignore())
                .ForMember(dest => dest.CompensationRateDollars, opt => opt.MapFrom(src => src.DesiredCompensationDollars))
                .ForMember(dest => dest.Locations, opt => opt.MapFrom(src => src.Locations))
                .ForMember(dest => dest.CumulativeTotalEtInAcreFeet, opt => opt.MapFrom(src => src.CumulativeTotalEtInAcreFeet));

            CreateMap<WaterConservationApplicationCreateRequest, EFWD.WaterConservationApplication>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ApplicantUser, opt => opt.Ignore())
                .ForMember(dest => dest.FundingOrganization, opt => opt.Ignore())
                .ForMember(dest => dest.Estimate, opt => opt.Ignore())
                .ForMember(dest => dest.Submission, opt => opt.Ignore())
                .ForMember(dest => dest.SupportingDocuments, opt => opt.Ignore());

            CreateMap<WaterConservationApplicationSubmissionRequest, EFWD.WaterConservationApplicationSubmission>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplication, opt => opt.Ignore())
                .ForMember(dest => dest.SubmissionNotes, opt => opt.Ignore())
                .ForMember(dest => dest.ApprovedDate, opt => opt.Ignore())
                .ForMember(dest => dest.DeniedDate, opt => opt.Ignore())
                .ForMember(dest => dest.SubmittedDate, opt => opt.MapFrom(_ => DateTimeOffset.UtcNow))
                .ForMember(dest => dest.ApprovedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.RecommendedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.RecommendedForDate, opt => opt.Ignore())
                .ForMember(dest => dest.RecommendedAgainstDate, opt => opt.Ignore())
                .ForMember(dest => dest.RecommendedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.ApprovedByUser, opt => opt.Ignore())
                .ForMember(dest => dest.RecommendedByUser, opt => opt.Ignore());

            CreateMap<WaterConservationApplicationSubmissionUpdateRequest, EFWD.WaterConservationApplicationSubmission>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplication, opt => opt.Ignore())
                .ForMember(dest => dest.SubmissionNotes, opt => opt.Ignore())
                .ForMember(dest => dest.ApprovedDate, opt => opt.Ignore())
                .ForMember(dest => dest.DeniedDate, opt => opt.Ignore())
                .ForMember(dest => dest.ApprovedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.SubmittedDate, opt => opt.Ignore())
                .ForMember(dest => dest.RecommendedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.RecommendedForDate, opt => opt.Ignore())
                .ForMember(dest => dest.RecommendedAgainstDate, opt => opt.Ignore())
                .ForMember(dest => dest.ApprovedByUser, opt => opt.Ignore())
                .ForMember(dest => dest.RecommendedByUser, opt => opt.Ignore());

            CreateMap<WaterConservationApplicationSubmissionUpdateRequest, EFWD.WaterConservationApplicationSubmissionNote>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationSubmissionId, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationSubmission, opt => opt.Ignore())
                .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(_ => DateTimeOffset.UtcNow))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UpdatedByUserId));

            CreateMap<WaterConservationApplicationRecommendationRequest, EFWD.WaterConservationApplicationSubmission>(MemberList.Source)
                .ForSourceMember(src => src.WaterConservationApplicationId, opt => opt.DoNotValidate())
                .ForSourceMember(src => src.RecommendationNotes, opt => opt.DoNotValidate())
                .ForSourceMember(src => src.RecommendationDecision, opt => opt.DoNotValidate())
                .ForMember(dest => dest.RecommendedForDate,
                    opt => opt.MapFrom(src => src.RecommendationDecision == RecommendationDecision.For ? DateTimeOffset.UtcNow : (DateTimeOffset?)null))
                .ForMember(dest => dest.RecommendedAgainstDate,
                    opt => opt.MapFrom(src => src.RecommendationDecision == RecommendationDecision.Against ? DateTimeOffset.UtcNow : (DateTimeOffset?)null));

            CreateMap<WaterConservationApplicationRecommendationRequest, EFWD.WaterConservationApplicationSubmissionNote>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationSubmission, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationSubmissionId, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.RecommendedByUserId))
                .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(_ => DateTimeOffset.UtcNow))
                .ForMember(dest => dest.Note, opt => opt.MapFrom(src => src.RecommendationNotes));

            CreateMap<WaterConservationApplicationApprovalRequest, EFWD.WaterConservationApplicationSubmission>(MemberList.Source)
                .ForSourceMember(src => src.WaterConservationApplicationId, opt => opt.DoNotValidate())
                .ForSourceMember(src => src.ApprovalNotes, opt => opt.DoNotValidate())
                .ForSourceMember(src => src.ApprovalDecision, opt => opt.DoNotValidate())
                .ForMember(dest => dest.ApprovedDate, opt => opt.MapFrom(src => src.ApprovalDecision == ApprovalDecision.Approved ? DateTimeOffset.UtcNow : (DateTimeOffset?)null))
                .ForMember(dest => dest.DeniedDate, opt => opt.MapFrom(src => src.ApprovalDecision == ApprovalDecision.Denied ? DateTimeOffset.UtcNow : (DateTimeOffset?)null));

            CreateMap<WaterConservationApplicationApprovalRequest, EFWD.WaterConservationApplicationSubmissionNote>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationSubmission, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationSubmissionId, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.ApprovedByUserId))
                .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(_ => DateTimeOffset.UtcNow))
                .ForMember(dest => dest.Note, opt => opt.MapFrom(src => src.ApprovalNotes));

            CreateMap<WaterConservationApplicationDocument, EFWD.WaterConservationApplicationDocument>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationId, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplication, opt => opt.Ignore());

            CreateMap<ApplicationSubmissionFieldDetail, EFWD.WaterConservationApplicationEstimateLocation>(MemberList.Source)
                .ForSourceMember(src => src.WaterConservationApplicationEstimateLocationId, opt => opt.DoNotValidate());

            CreateMap<ApplicationEstimateUpdateLocationDetails, EFWD.WaterConservationApplicationEstimateLocation>()
                .ForMember(dest => dest.WaterMeasurements, opt => opt.MapFrom(src => src.ConsumptiveUses))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationEstimateId, opt => opt.Ignore())
                .ForMember(dest => dest.AdditionalDetails, opt => opt.Ignore()) // special case; this property is carried over
                .ForMember(dest => dest.Estimate, opt => opt.Ignore());

            CreateMap<ApplicationEstimateUpdateRequest, EFWD.WaterConservationApplicationEstimate>()
                // these fields are being managed manually
                .ForMember(dest => dest.Locations, opt => opt.Ignore())
                .ForMember(dest => dest.ControlLocations, opt => opt.Ignore())
                // these fields should not change when updating the estimate
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Model, opt => opt.Ignore())
                .ForMember(dest => dest.DateRangeStart, opt => opt.Ignore())
                .ForMember(dest => dest.DateRangeEnd, opt => opt.Ignore())
                .ForMember(dest => dest.CompensationRateDollars, opt => opt.Ignore())
                .ForMember(dest => dest.CompensationRateUnits, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplication, opt => opt.Ignore());

            CreateMap<EFWD.WaterConservationApplicationEstimateLocation, ApplicationEstimateLocationDetails>()
                .ForMember(dest => dest.WaterConservationApplicationEstimateLocationId, opt => opt.MapFrom(src => src.Id));

            CreateMap<EFWD.WaterConservationApplicationEstimateControlLocation, ApplicationEstimateControlLocationDetails>()
                .ForMember(dest => dest.WaterConservationApplicationEstimateControlLocationId, opt => opt.MapFrom(src => src.Id));

            CreateMap<EFWD.WaterConservationApplication, ApplicationDetails>()
                .ForMember(dest => dest.Notes, opt =>
                {
                    opt.PreCondition(src => src.Submission != null);
                    opt.MapFrom(src => src.Submission.SubmissionNotes.OrderBy(note => note.Timestamp));
                })
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => EvaluateApplicationStatus(
                    src.Submission.RecommendedByUserId,
                    src.Submission.ApprovedDate,
                    src.Submission.DeniedDate
                )))
                // Mapped in accessor
                .ForMember(dest => dest.MapImageUrl, opt => opt.Ignore())
                .ForMember(dest => dest.ReviewPipeline, opt => opt.Ignore());

            CreateMap<EFWD.WaterConservationApplicationEstimate, EstimateDetails>()
                .ForMember(dest => dest.ControlLocation, opt => opt.MapFrom(src => src.ControlLocations.SingleOrDefault()));

            CreateMap<EFWD.WaterConservationApplicationEstimateLocation, LocationDetails>()
                .ForMember(dest => dest.AverageYearlyTotalEtInInches, opt => opt.MapFrom(src => src.WaterMeasurements.Average(wm => wm.TotalEtInInches)))
                .ForMember(dest => dest.AverageYearlyTotalEtInAcreFeet, opt => opt.MapFrom(src => src.WaterMeasurements.Average(wm => wm.TotalEtInInches / 12) * src.PolygonAreaInAcres))
                .ForMember(dest => dest.AverageYearlyNetEtInInches, opt => opt.MapFrom(src => src.WaterMeasurements.Average(wm => wm.NetEtInInches)))
                .ForMember(dest => dest.AverageYearlyNetEtInAcreFeet, opt => opt.MapFrom(src => src.WaterMeasurements.Average(wm => wm.NetEtInInches / 12) * src.PolygonAreaInAcres));

            CreateMap<EFWD.LocationWaterMeasurement, LocationWaterMeasurementDetails>();

            CreateMap<EFWD.WaterConservationApplicationEstimateControlLocation, ControlLocationDetails>();

            CreateMap<EFWD.ControlLocationWaterMeasurement, ControlLocationWaterMeasurementDetails>();

            CreateMap<EFWD.WaterConservationApplicationSubmission, SubmissionDetails>();
            CreateMap<EFWD.WaterConservationApplicationDocument, SupportingDocumentDetails>();
            CreateMap<EFWD.WaterConservationApplicationSubmissionNote, ApplicationReviewNote>()
                .ForMember(dest => dest.SubmittedDate, opt => opt.MapFrom(src => src.Timestamp))
                .ForMember(dest => dest.SubmittedByUserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.SubmittedByFullName, opt => opt.MapFrom(src => $"{src.User.UserProfile.FirstName} {src.User.UserProfile.LastName}"));
            CreateMap<EFWD.WaterConservationApplication, ApplicationExistsLoadResponse>()
                .ForMember(dest => dest.ApplicationExists, opt => opt.MapFrom(_ => true))
                .ForMember(dest => dest.ApplicationId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => EvaluateApplicationStatus(
                    src.Submission.RecommendedByUserId,
                    src.Submission.ApprovedDate,
                    src.Submission.DeniedDate
                )))
                .ForMember(dest => dest.EstimateLocationIds, opt => opt.MapFrom(src => src.Estimate.Locations.Select(loc => loc.Id).ToArray()));

            CreateMap<WaterConservationApplicationNoteCreateRequest, EFWD.WaterConservationApplicationSubmissionNote>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.CreatedByUserId))
                .ForMember(dest => dest.WaterConservationApplicationSubmissionId, opt => opt.Ignore())
                .ForMember(dest => dest.WaterConservationApplicationSubmission, opt => opt.Ignore())
                .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(_ => DateTimeOffset.UtcNow));
        }

        // duplicated in other ApiProfile.cs
        public static ConservationApplicationStatus EvaluateApplicationStatus(Guid? recommendedByUserId, DateTimeOffset? approvedDate, DateTimeOffset? deniedDate)
        {
            return (recommendedByUserId, approvedDate, deniedDate) switch
            {
                (null, null, null) => ConservationApplicationStatus.InTechnicalReview,
                (not null, null, null) => ConservationApplicationStatus.InFinalReview,
                (_, not null, null) => ConservationApplicationStatus.Approved,
                (_, null, not null) => ConservationApplicationStatus.Denied,
                _ => ConservationApplicationStatus.Unknown
            };
        }
    }
}