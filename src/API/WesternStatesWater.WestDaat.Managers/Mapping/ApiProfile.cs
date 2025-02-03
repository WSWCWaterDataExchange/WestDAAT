using AutoMapper;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;
using ClientContracts = WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers.Mapping
{
    internal class ApiProfile : Profile
    {
        public ApiProfile()
        {
            CreateMap<CommonContracts.WaterRightsDigest, ClientContracts.WaterRightsDigest>();
            CreateMap<CommonContracts.WaterSourceInfoListItem, ClientContracts.WaterSourceInfoListItem>();
            CreateMap<CommonContracts.WaterRightInfoListItem, ClientContracts.WaterRightInfoListItem>();
            CreateMap<CommonContracts.WaterRightsSearchResults, ClientContracts.WaterRightsSearchResults>();
            CreateMap<CommonContracts.WaterRightsSearchDetail, ClientContracts.WaterRightsSearchDetail>();
            CreateMap<ClientContracts.WaterRightsSearchCriteria, CommonContracts.WaterRightsSearchCriteria>()
                .ForMember(x => x.FilterGeometry, opt => opt.Ignore());
            CreateMap<CommonContracts.SiteInfoListItem, ClientContracts.SiteInfoListItem>();
            CreateMap<CommonContracts.WaterRightDetails, ClientContracts.WaterRightDetails>();
            CreateMap<CommonContracts.SiteDetails, ClientContracts.SiteDetails>();
            CreateMap<CommonContracts.SiteDigest, ClientContracts.SiteDigest>();
            CreateMap<CommonContracts.BeneficialUseItem, ClientContracts.BeneficialUseItem>();
            CreateMap<CommonContracts.AnalyticsSummaryInformation, ClientContracts.AnalyticsSummaryInformation>();
            CreateMap<CommonContracts.DashboardFilters, ClientContracts.DashboardFilters>();
            CreateMap<CommonContracts.SiteUsagePoint, ClientContracts.SiteUsagePoint>();
            CreateMap<CommonContracts.SiteUsageListItem, ClientContracts.SiteUsageListItem>();
            CreateMap<CommonContracts.VariableInfoListItem, ClientContracts.VariableInfoListItem>();
            CreateMap<CommonContracts.MethodInfoListItem, ClientContracts.MethodInfoListItem>();
            CreateMap<CommonContracts.OverlayDetails, ClientContracts.OverlayDetails>()
                .ForMember(dest => dest.Geometry, opt => opt.Ignore());
            CreateMap<ClientContracts.OverlayDetailsSearchCriteria, CommonContracts.OverlayDetailsSearchCriteria>();
            CreateMap<CommonContracts.OverlayTableEntry, ClientContracts.OverlayTableEntry>();
            CreateMap<CommonContracts.OverlayDigest, ClientContracts.OverlayDigest>();

            AddUserMappings();
            AddOrganizationMappings();
            AddApplicationMappings();
        }

        private void AddUserMappings()
        {
            CreateMap<ClientContracts.Requests.Admin.EnrichJwtRequest, CommonContracts.UserLoadRolesRequest>()
                .ForMember(dest => dest.ExternalAuthId, opt => opt.MapFrom(src => src.ObjectId));

            const string azureB2CVersionString = "1.0.0";
            const string azureB2CContinuanceAction = "Continue";
            CreateMap<CommonContracts.UserLoadRolesResponse, ClientContracts.Responses.Admin.EnrichJwtResponse>()
                .ForMember(dest => dest.Version, opt => opt.MapFrom(_ => azureB2CVersionString))
                .ForMember(dest => dest.Action, opt => opt.MapFrom(_ => azureB2CContinuanceAction))
                .ForMember(dest => dest.Extension_WestDaat_UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Extension_WestDaat_Roles, opt => opt.MapFrom(src =>
                        string.Join(',', src.UserRoles.Select(role => $"rol_{role}"))
                    )
                )
                .ForMember(dest => dest.Extension_WestDaat_OrganizationRoles, opt => opt.MapFrom(src =>
                        string.Join(',', src.UserOrganizationRoles.Select(orgRole => $"org_{orgRole.OrganizationId}/rol_{orgRole.Role}"))
                    )
                )
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<ClientContracts.Requests.Admin.EnrichJwtRequest, CommonContracts.UserExistsRequest>()
                .ForMember(dest => dest.ExternalAuthId, opt => opt.MapFrom(src => src.ObjectId));

            CreateMap<ClientContracts.Requests.Admin.EnrichJwtRequest, CommonContracts.UserStoreCreateRequest>()
                .ForMember(dest => dest.ExternalAuthId, opt => opt.MapFrom(src => src.ObjectId));
        }

        private void AddOrganizationMappings()
        {
            CreateMap<ClientContracts.Requests.Admin.OrganizationLoadAllRequest, CommonContracts.OrganizationLoadAllRequest>();

            CreateMap<CommonContracts.OrganizationLoadAllResponse, ClientContracts.Responses.Admin.OrganizationLoadAllResponse>()
                .ForMember(dest => dest.Organizations, opt => opt.MapFrom(src => src.Organizations))
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<CommonContracts.OrganizationListItem, ClientContracts.OrganizationListItem>();
        }

        private void AddApplicationMappings()
        {
            CreateMap<ClientContracts.Requests.Conservation.OrganizationApplicationDashboardLoadRequest, CommonContracts.ApplicationDashboardLoadRequest>()
                .ForMember(dest => dest.OrganizationId, opt => opt.MapFrom(src => src.OrganizationIdFilter));

            CreateMap<CommonContracts.ApplicationDashboardLoadResponse, ClientContracts.Responses.Conservation.OrganizationApplicationDashboardLoadResponse>()
                .ForMember(dest => dest.Statistics, opt => opt.Ignore())
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<CommonContracts.ApplicationDashboardLoadDetails, ClientContracts.Responses.Conservation.OrganizationApplicationDashboardListItem>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => FormatApplicationStatus(src.Status)))
                .ForMember(dest => dest.CompensationRateUnits, opt => opt.MapFrom(src => FormatApplicationCompensationRateUnits(src.CompensationRateUnits)));

            CreateMap<ClientContracts.Requests.Conservation.EstimateConsumptiveUseRequest, CommonContracts.MultiPolygonYearlyEtRequest>();

            CreateMap<(ClientContracts.Requests.Conservation.EstimateConsumptiveUseRequest Request, CommonContracts.MultiPolygonYearlyEtResponse EtData),
                    CommonContracts.EstimateConservationPaymentRequest>()
                .ForMember(dest => dest.CompensationRateDollars, opt => opt.MapFrom(src => src.Request.CompensationRateDollars))
                .ForMember(dest => dest.CompensationRateUnits, opt => opt.MapFrom(src => src.Request.Units))
                .ForMember(dest => dest.DataCollections, opt => opt.MapFrom(src => src.EtData.DataCollections));

            CreateMap<CommonContracts.PolygonEtDatapoint, ClientContracts.PolygonEtDatapoint>();

            CreateMap<CommonContracts.PolygonEtDataCollection, ClientContracts.PolygonEtDataCollection>();
        }

        // TODO: JN - also leave this as a public function here, or live with enum?
        public static string FormatApplicationStatus(CommonContracts.ConservationApplicationStatus status)
        {
            return status switch
            {
                CommonContracts.ConservationApplicationStatus.InReview => "In Review",
                CommonContracts.ConservationApplicationStatus.Approved => "Approved",
                CommonContracts.ConservationApplicationStatus.Rejected => "Rejected",
                // TODO: JN - unknown / default cases?
                CommonContracts.ConservationApplicationStatus.Unknown => "Unknown",
                _ => "Unknown"
            };
        }
        
        // TODO: JN - also leave this as a public function here, or live with enum?
        public static string FormatApplicationCompensationRateUnits(CommonContracts.CompensationRateUnits units)
        {
            return units switch
            {
                CommonContracts.CompensationRateUnits.AcreFeet => "Acre-Feet",
                CommonContracts.CompensationRateUnits.Acres => "Acres",
                // TODO: JN - none / default cases?
                CommonContracts.CompensationRateUnits.None => "None",
                _ => "None"
            };
        }
    }
}