using AutoMapper;
using WesternStatesWater.WestDaat.Utilities;
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

            CreateMap<ClientContracts.Requests.Admin.UserSearchRequest, CommonContracts.UserSearchRequest>();

            CreateMap<CommonContracts.UserSearchResponse, ClientContracts.Responses.Admin.UserSearchResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<CommonContracts.UserSearchResult, ClientContracts.UserSearchResult>();

            CreateMap<ClientContracts.Requests.Admin.UserProfileRequest, CommonContracts.UserProfileRequest>();

            CreateMap<CommonContracts.UserProfileResponse, ClientContracts.Responses.Admin.UserProfileResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<CommonContracts.UserProfile, ClientContracts.UserProfile>();

            CreateMap<CommonContracts.OrganizationMembership, ClientContracts.OrganizationMembership>();

            CreateMap<ClientContracts.Requests.Admin.UserProfileCreateRequest, CommonContracts.UserProfileCreateRequest>()
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.UserName, opt => opt.Ignore());

            CreateMap<ClientContracts.Requests.Admin.UserProfileUpdateRequest, CommonContracts.UserProfileUpdateRequest>()
                .ForMember(dest => dest.UserId, opt => opt.Ignore());
        }

        private void AddOrganizationMappings()
        {
            CreateMap<ClientContracts.Requests.Admin.OrganizationDetailsListRequest, CommonContracts.OrganizationDetailsListRequest>();

            CreateMap<CommonContracts.OrganizationDetailsListResponse, ClientContracts.Responses.Admin.OrganizationDetailsListResponse>()
                .ForMember(dest => dest.Organizations, opt => opt.MapFrom(src => src.Organizations))
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<CommonContracts.OrganizationListItem, ClientContracts.OrganizationListItem>();

            CreateMap<ClientContracts.Requests.Admin.OrganizationMemberAddRequest, CommonContracts.OrganizationMemberAddRequest>();

            CreateMap<ClientContracts.Requests.Admin.OrganizationMemberRemoveRequest, CommonContracts.OrganizationMemberRemoveRequest>();

            CreateMap<ClientContracts.Requests.Admin.OrganizationMemberUpdateRequest, CommonContracts.OrganizationMemberUpdateRequest>();

            CreateMap<ClientContracts.Requests.Admin.OrganizationSummaryListRequest, CommonContracts.OrganizationDetailsListRequest>();

            CreateMap<CommonContracts.OrganizationDetailsListResponse, ClientContracts.Responses.Admin.OrganizationSummaryListResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<CommonContracts.OrganizationListItem, ClientContracts.OrganizationSummaryItem>();

            CreateMap<CommonContracts.OrganizationMemberAddResponse, ClientContracts.Responses.Admin.OrganizationMemberAddResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<CommonContracts.OrganizationMemberRemoveResponse, ClientContracts.Responses.Admin.OrganizationMemberRemoveResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<CommonContracts.OrganizationMemberUpdateResponse, ClientContracts.Responses.Admin.OrganizationMemberUpdateResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<ClientContracts.Requests.Admin.OrganizationUserListRequest, CommonContracts.UserListRequest>();

            CreateMap<ClientContracts.Requests.Admin.UserListRequest, CommonContracts.UserListRequest>()
                .ForMember(dest => dest.OrganizationId, opt => opt.MapFrom(_ => (Guid?)null));

            CreateMap<CommonContracts.UserListResponse, ClientContracts.Responses.Admin.UserListResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<CommonContracts.UserListResult, ClientContracts.UserListResult>();

            CreateMap<CommonContracts.WaterRightFundingOrgDetails, CommonContracts.OrganizationFundingDetailsRequest>()
                .ForMember(dest => dest.OrganizationId, opt => opt.MapFrom(src => src.FundingOrganizationId));

            CreateMap<CommonContracts.OrganizationFundingDetails, ClientContracts.OrganizationFundingDetails>();

            CreateMap<CommonContracts.OrganizationFundingDetailsResponse, ClientContracts.Responses.Admin.OrganizationFundingDetailsResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());
        }

        private void AddApplicationMappings()
        {
            CreateMap<ClientContracts.Requests.Conservation.WaterConservationApplicationCreateRequest, CommonContracts.WaterConservationApplicationCreateRequest>()
                .ForMember(dest => dest.ApplicantUserId, opt => opt.Ignore())
                .ForMember(dest => dest.ApplicationDisplayId, opt => opt.Ignore());

            CreateMap<CommonContracts.WaterConservationApplicationCreateRequest, CommonContracts.ApplicationExistsLoadRequest>()
                .ForMember(dest => dest.HasSubmission, opt => opt.MapFrom(_ => false))
                .ForMember(dest => dest.ApplicationId, opt => opt.Ignore());

            CreateMap<CommonContracts.WaterConservationApplicationCreateRequest, CommonContracts.ApplicationFormatDisplayIdRequest>();

            CreateMap<CommonContracts.WaterConservationApplicationCreateResponse, ClientContracts.Responses.Conservation.WaterConservationApplicationCreateResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<ClientContracts.Requests.Conservation.OrganizationApplicationDashboardLoadRequest, CommonContracts.ApplicationDashboardLoadRequest>()
                .ForMember(dest => dest.OrganizationId, opt => opt.MapFrom(src => src.OrganizationIdFilter));

            CreateMap<CommonContracts.ApplicationDashboardLoadResponse, ClientContracts.Responses.Conservation.OrganizationApplicationDashboardLoadResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<CommonContracts.ApplicationListItemDetails, ClientContracts.Responses.Conservation.ApplicationDashboardListItem>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => EvaluateApplicationStatus(src.AcceptedDate, src.RejectedDate)))
                .ForMember(dest => dest.TotalObligationDollars, opt => opt.MapFrom(src => src.EstimatedCompensationDollars))
                .ForMember(dest => dest.TotalWaterVolumeSavingsAcreFeet, opt => opt.MapFrom(src => src.TotalAverageYearlyConsumptionEtAcreFeet));

            CreateMap<
                    (ClientContracts.Requests.Conservation.EstimateConsumptiveUseRequest Request, CommonContracts.OrganizationFundingDetails Organization),
                    CommonContracts.MultiPolygonYearlyEtRequest>()
                .ForMember(dest => dest.Polygons, opt => opt.MapFrom(src => src.Request.Polygons))
                .ForMember(dest => dest.Model, opt => opt.MapFrom(src => src.Organization.OpenEtModel))
                .ForMember(dest => dest.DateRangeStart, opt => opt.MapFrom(src => src.Organization.OpenEtDateRangeStart))
                .ForMember(dest => dest.DateRangeEnd, opt => opt.MapFrom(src => src.Organization.OpenEtDateRangeEnd));

            CreateMap<(ClientContracts.Requests.Conservation.EstimateConsumptiveUseRequest Request, CommonContracts.MultiPolygonYearlyEtResponse EtData),
                    CommonContracts.EstimateConservationPaymentRequest>()
                .ForMember(dest => dest.CompensationRateDollars, opt => opt.MapFrom(src => src.Request.CompensationRateDollars))
                .ForMember(dest => dest.CompensationRateUnits, opt => opt.MapFrom(src => src.Request.Units))
                .ForMember(dest => dest.DataCollections, opt => opt.MapFrom(src => src.EtData.DataCollections));

            CreateMap<CommonContracts.PolygonEtDatapoint, ClientContracts.PolygonEtDatapoint>();

            CreateMap<CommonContracts.PolygonEtDataCollection, ClientContracts.PolygonEtDataCollection>();

            CreateMap<CommonContracts.PolygonEtDataCollection, CommonContracts.ApplicationEstimateStoreLocationDetails>()
                .ConvertUsing((src, dest) =>
                {
                    var polygonAreaInAcres = GeometryHelpers.GetGeometryAreaInAcres(GeometryHelpers.GetGeometryByWkt(src.PolygonWkt));
                    return new CommonContracts.ApplicationEstimateStoreLocationDetails
                    {
                        PolygonWkt = src.PolygonWkt,
                        PolygonAreaInAcres = polygonAreaInAcres,
                        ConsumptiveUses = src.Datapoints.Select(y => new CommonContracts.ApplicationEstimateStoreLocationConsumptiveUseDetails
                        {
                            Year = y.Year,
                            EtInInches = y.EtInInches,
                        }).ToArray()
                    };
                });

            CreateMap<(
                    ClientContracts.Requests.Conservation.EstimateConsumptiveUseRequest Request,
                    CommonContracts.OrganizationFundingDetails Organization,
                    CommonContracts.MultiPolygonYearlyEtResponse EtResponse,
                    CommonContracts.EstimateConservationPaymentResponse PaymentResponse
                    ),
                    CommonContracts.ApplicationEstimateStoreRequest
                >()
                .ForMember(dest => dest.WaterConservationApplicationId, opt => opt.MapFrom(src => src.Request.WaterConservationApplicationId))
                .ForMember(dest => dest.Model, opt => opt.MapFrom(src => src.Organization.OpenEtModel))
                .ForMember(dest => dest.DateRangeStart, opt => opt.MapFrom(src => src.Organization.OpenEtDateRangeStart))
                .ForMember(dest => dest.DateRangeEnd, opt => opt.MapFrom(src => src.Organization.OpenEtDateRangeEnd))
                .ForMember(dest => dest.DesiredCompensationDollars, opt => opt.MapFrom(src => src.Request.CompensationRateDollars.Value))
                .ForMember(dest => dest.CompensationRateUnits, opt => opt.MapFrom(src => src.Request.Units.Value))
                .ForMember(dest => dest.EstimatedCompensationDollars, opt => opt.MapFrom(src => src.PaymentResponse.EstimatedCompensationDollars))
                .ForMember(dest => dest.Locations, opt => opt.MapFrom(src => src.EtResponse.DataCollections))
                .ForMember(dest => dest.TotalAverageYearlyEtAcreFeet, opt => opt.MapFrom(src => src.EtResponse.DataCollections.Sum(dc => dc.AverageYearlyEtInAcreFeet)));

            CreateMap<ClientContracts.Requests.Conservation.WaterConservationApplicationSubmissionRequest, CommonContracts.WaterConservationApplicationSubmissionRequest>();

            CreateMap<ClientContracts.Requests.Conservation.WaterConservationApplicationSubmissionUpdateRequest,
                    CommonContracts.WaterConservationApplicationSubmissionUpdateRequest>()
                .ForMember(dest => dest.UpdatedByUserId, opt => opt.Ignore());

            CreateMap<ClientContracts.ApplicationSubmissionFieldDetail, CommonContracts.ApplicationSubmissionFieldDetail>();

            CreateMap<ClientContracts.Requests.Conservation.WaterConservationApplicationDocument, CommonContracts.WaterConservationApplicationDocument>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<ClientContracts.Requests.Conservation.ApplicantConservationApplicationLoadRequest, CommonContracts.ApplicationLoadSingleRequest>();
            CreateMap<ClientContracts.Requests.Conservation.ReviewerConservationApplicationLoadRequest, CommonContracts.ApplicationLoadSingleRequest>();

            CreateMap<CommonContracts.ApplicationLoadSingleResponse, ClientContracts.Responses.Conservation.ApplicantConservationApplicationLoadResponse>()
                .ForMember(dest => dest.Error, opt => opt.Ignore());
            CreateMap<CommonContracts.ApplicationLoadSingleResponse, ClientContracts.Responses.Conservation.ReviewerConservationApplicationLoadResponse>()
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Application.Notes))
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            CreateMap<ClientContracts.Requests.Admin.ApplicationDocumentDownloadSasTokenRequest, CommonContracts.ApplicationDocumentLoadSingleRequest>();

            CreateMap<ClientContracts.Requests.Conservation.WaterConservationApplicationSubmittedEvent, CommonContracts.WaterConservationApplicationSubmittedEvent>();
        }

        public static CommonContracts.ConservationApplicationStatus EvaluateApplicationStatus(DateTimeOffset? acceptedDate, DateTimeOffset? rejectedDate)
        {
            return (acceptedDate, rejectedDate) switch
            {
                (null, null) => CommonContracts.ConservationApplicationStatus.InReview,
                (not null, null) => CommonContracts.ConservationApplicationStatus.Approved,
                (null, not null) => CommonContracts.ConservationApplicationStatus.Rejected,
                _ => CommonContracts.ConservationApplicationStatus.Unknown
            };
        }
    }
}