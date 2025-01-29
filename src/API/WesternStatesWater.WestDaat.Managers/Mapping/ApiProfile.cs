using AutoMapper;
using ClientContracts = WesternStatesWater.WestDaat.Contracts.Client;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

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
            CreateMap<ClientContracts.Requests.Conservation.EstimateConsumptiveUseRequest, CommonContracts.MultiPolygonYearlyEtRequest>();
        }
    }
}