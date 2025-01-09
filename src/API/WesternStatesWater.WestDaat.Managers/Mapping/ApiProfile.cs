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
            CreateMap<CommonContracts.VariableInfoListItem, ClientContracts.VariableInfoListItem>();
            CreateMap<CommonContracts.MethodInfoListItem, ClientContracts.MethodInfoListItem>();
            CreateMap<CommonContracts.OverlayDetails, ClientContracts.OverlayDetails>()
                .ForMember(dest => dest.Geometry, opt => opt.Ignore());
            CreateMap<CommonContracts.OverlayTableEntry, ClientContracts.OverlayTableEntry>();

            AddUserMappings();
        }

        private void AddUserMappings()
        {
            CreateMap<ClientContracts.Requests.Admin.EnrichJwtRequest, CommonContracts.UserLoadRolesRequest>()
                .ForMember(dest => dest.ExternalAuthId, opt => opt.MapFrom(src => src.ObjectId));

            const string azureB2CVersionString = "1.0.0";
            const string azureB2CContinuanceAction = "Continue";
            CreateMap<CommonContracts.UserLoadRolesResponse, ClientContracts.Responses.Admin.EnrichJwtResponse>()
                .ForMember(dest => dest.Version, opt => opt.Map(() => azureB2CVersionString))
                .ForMember(dest => dest.Action, opt => opt.Map(() => azureB2CContinuanceAction))
                .ForMember(dest => dest.Extension_WestDaat_Roles, opt => opt.MapFrom(src => string.Join(',', src.RoleNames)));
        }
    }
}